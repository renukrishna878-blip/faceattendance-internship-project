import sys
import io

# Force UTF-8 encoding for Windows to prevent Deepface emoji print crashes
if sys.platform.startswith('win'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
import uvicorn
import json
import cv2
import numpy as np
import time
import os
from PIL import Image, ImageOps
from typing import List

try:
    from deepface import DeepFace
    MOCK_MODE = False
    print("Running with real DeepFace model.")
except ImportError:
    MOCK_MODE = True
    print("\n" + "="*60)
    print("WARNING: DeepFace or TensorFlow is not installed.")
    print("Running AI Service in MOCK MODE.")
    print("="*60 + "\n")

def decode_image_upright(contents: bytes) -> np.ndarray:
    """
    Decodes image bytes and automatically corrects EXIF rotation (portrait/landscape).
    """
    try:
        pil_img = Image.open(io.BytesIO(contents))
        pil_img = ImageOps.exif_transpose(pil_img)
        return cv2.cvtColor(np.array(pil_img.convert('RGB')), cv2.COLOR_RGB2BGR)
    except Exception:
        nparr = np.frombuffer(contents, np.uint8)
        return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

app = FastAPI(title="Face Attendance AI Service (Mockable)")

# Configuration
MODEL_NAME = "ArcFace"
DETECTOR_BACKEND = "retinaface"
CONFIDENCE_THRESHOLD = 0.60 # Cosine distance threshold

_is_warmed_up = MOCK_MODE

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Face Recognition AI", "warmed_up": _is_warmed_up, "mock_mode": MOCK_MODE}

@app.post("/register-student")
async def register_student(photos: List[UploadFile] = File(...)):
    """
    Receives profile photos for a student and generates a Face Embedding.
    """
    if MOCK_MODE:
        # In mock mode, we generate a random 512-dimension vector matching ArcFace output
        dummy_embedding = np.random.uniform(-0.15, 0.15, 512).tolist()
        return {
            "success": True,
            "embedding": dummy_embedding,
            "dimensions": 512
        }

    embeddings = []
    try:
        for photo in photos:
            contents = await photo.read()
            img = decode_image_upright(contents)

            # Extract embeddings using ArcFace + RetinaFace
            objs = DeepFace.represent(
                img_path=img,
                model_name=MODEL_NAME,
                detector_backend=DETECTOR_BACKEND,
                enforce_detection=True
            )
            
            # objs is a list of dictionaries. We take the primary face.
            if len(objs) > 0:
                embeddings.append(objs[0]["embedding"])
        
        if not embeddings:
            return {"success": False, "error": "No faces detected in the provided photos."}
        
        # Average the embeddings if multiple photos were provided to create a robust profile
        avg_embedding = np.mean(embeddings, axis=0).tolist()
        
        return {
            "success": True,
            "embedding": avg_embedding,
            "dimensions": len(avg_embedding)
        }
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return {"success": False, "error": str(e)}


@app.post("/recognize-class")
async def recognize_class(
    classroom_image: UploadFile = File(...),
    students_json: str = Form(...) # JSON string of [{"id": 1, "embedding": [0.1, 0.2...]}]
):
    """
    Receives a crowded classroom photo and a roster with embeddings.
    Extracts all faces, calculates similarities, and returns the matches.
    """
    start_time = time.time()
    try:
        # Parse Roster
        roster = json.loads(students_json)

        if MOCK_MODE:
            results = []
            # In mock mode, mark the first 2/3 of the students present and the rest absent
            for idx, student in enumerate(roster):
                if idx < len(roster) * 2 / 3:
                    # Present
                    results.append({
                        "student_id": student["id"],
                        "status": "Present",
                        "confidence_score": 0.85 + (idx % 10) * 0.01,
                        "bounding_box": [100 + (idx * 40), 120, 80, 80]
                    })
                else:
                    # Absent
                    results.append({
                        "student_id": student["id"],
                        "status": "Absent",
                        "confidence_score": 0.0,
                        "bounding_box": None
                    })
            return {
                "success": True,
                "results": results,
                "unrecognized_faces": []
            }

        # 1. Parse Image & Auto-correct EXIF rotation
        contents = await classroom_image.read()
        img = decode_image_upright(contents)

        # We need to filter out roster students who don't have embeddings (e.g. they failed registration or are mock data)
        valid_roster = [s for s in roster if "embedding" in s and s["embedding"] and len(s["embedding"]) > 0]
        
        # If roster is empty or no embeddings exist, throw a clean error directly instead of mocking
        if not valid_roster:
            return {"success": False, "error": "No valid student embeddings found in roster. Please register student photos first."}

        # 3. Detect ALL faces in the classroom
        # We use extract_faces to get bounding boxes, then represent. DeepFace.represent can do both!
        faces_detected = DeepFace.represent(
            img_path=img,
            model_name=MODEL_NAME,
            detector_backend=DETECTOR_BACKEND,
            enforce_detection=False # Don't throw if no faces found
        )

        recognized_students = []
        unrecognized_faces = []
        
        # 4. Compare each face against the roster
        for face in faces_detected:
            # Deepface returns face_area: {'x': 118, 'y': 95, 'w': 105, 'h': 148}
            box = face.get("facial_area", {})
            bbox = [box.get('x', 0), box.get('y', 0), box.get('w', 0), box.get('h', 0)]
            
            face_embedding = np.array(face["embedding"])
            
            best_match_id = None
            best_similarity = -1
            
            for student in valid_roster:
                student_embedding = np.array(student["embedding"])
                
                # Cosine Similarity
                dot_product = np.dot(face_embedding, student_embedding)
                norm_a = np.linalg.norm(face_embedding)
                norm_b = np.linalg.norm(student_embedding)
                similarity = dot_product / (norm_a * norm_b)
                
                if similarity > best_similarity:
                    best_similarity = similarity
                    best_match_id = student["id"]
                    
            if best_similarity >= CONFIDENCE_THRESHOLD:
                recognized_students.append({
                    "student_id": best_match_id,
                    "status": "Present",
                    "confidence_score": float(round(best_similarity, 3)),
                    "bounding_box": bbox
                })
                # Remove matched student from roster so they aren't matched twice
                valid_roster = [s for s in valid_roster if s["id"] != best_match_id]
            else:
                unrecognized_faces.append({
                    "bounding_box": bbox,
                    "highest_similarity_score": float(round(best_similarity, 3))
                })

        # 5. Format the remaining absent students
        results = []
        recognized_ids = [r["student_id"] for r in recognized_students]
        
        for student in roster:
            if student["id"] in recognized_ids:
                match = next(r for r in recognized_students if r["student_id"] == student["id"])
                results.append(match)
            else:
                results.append({
                    "student_id": student["id"],
                    "status": "Absent",
                    "confidence_score": 0.0,
                    "bounding_box": None
                })
                
        print(f"Recognition completed in {time.time() - start_time:.2f} seconds.")
        
        return {
            "success": True,
            "results": results,
            "unrecognized_faces": unrecognized_faces
        }
        
    except Exception as e:
        print(f"Error in recognition: {e}")
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    if not MOCK_MODE:
        # Optional: Pre-load the models into memory before starting the server
        try:
            print("Warming up DeepFace models (ArcFace/RetinaFace)...")
            # A dummy numpy array of 224x224 (black image) to force weight downloads
            dummy = np.zeros((224, 224, 3), dtype=np.uint8)
            DeepFace.represent(dummy, model_name=MODEL_NAME, detector_backend=DETECTOR_BACKEND, enforce_detection=False)
            _is_warmed_up = True
            print("Models warmed up successfully!")
        except Exception as e:
            print(f"Model warm-up failed, weights will download on first request. Error: {e}")

    uvicorn.run(app, host="0.0.0.0", port=8000)
