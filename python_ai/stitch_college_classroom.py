# -*- coding: utf-8 -*-
import os
from PIL import Image, ImageDraw, ImageOps

def create_circular_avatar(image_path, size):
    img = Image.open(image_path).convert("RGBA")
    img = ImageOps.fit(img, (size, size), Image.Resampling.LANCZOS)
    
    # Create circular mask
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    
    # Apply mask
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask=mask)
    
    # Draw a thin white border around the avatar for premium look
    draw_border = ImageDraw.Draw(output)
    draw_border.ellipse((0, 0, size-1, size-1), outline="white", width=2)
    
    return output

def main():
    bg_path = r"C:\Users\hp\.gemini\antigravity-ide\brain\109e8c50-edfc-47fe-aba5-8b9991166286\lecture_hall_bg_1787381752657.jpg"
    bg = Image.open(bg_path).convert("RGBA")
    bg = bg.resize((1920, 1080), Image.Resampling.LANCZOS)
    
    # Bounding boxes matching MOCK_MODE coordinates
    COORDINATES = [
        # Row 1 (Front): sizes = 130x130
        (220, 720, 130, 130), # STU2026-001
        (450, 720, 130, 130), # STU2026-002
        (680, 720, 130, 130), # STU2026-003
        (1380, 800, 130, 130), # STU2026-004
        (1650, 800, 130, 130), # STU2026-005
        
        # Row 2: sizes = 105x105
        (300, 610, 105, 105), # STU2026-006
        (480, 610, 105, 105), # STU2026-007
        (660, 610, 105, 105), # STU2026-008 (Absent)
        (840, 610, 105, 105), # STU2026-009
        (1420, 670, 105, 105), # STU2026-010
        (1630, 670, 105, 105), # STU2026-011
        
        # Row 3: sizes = 85x85
        (360, 520, 85, 85), # STU2026-012
        (510, 520, 85, 85), # STU2026-013
        (660, 520, 85, 85), # STU2026-014
        (810, 520, 85, 85), # STU2026-015 (Absent)
        (1440, 570, 85, 85), # STU2026-016
        (1620, 570, 85, 85), # STU2026-017
        
        # Row 4: sizes = 70x70
        (410, 450, 70, 70), # STU2026-018
        (530, 450, 70, 70), # STU2026-019
        (650, 450, 70, 70), # STU2026-020
        (770, 450, 70, 70), # STU2026-021
        (1460, 500, 70, 70), # STU2026-022 (Absent)
        (1600, 500, 70, 70), # STU2026-023
        
        # Row 5: sizes = 55x55
        (440, 390, 55, 55), # STU2026-024
        (540, 390, 55, 55), # STU2026-025
        (640, 390, 55, 55), # STU2026-026
        (740, 390, 55, 55), # STU2026-027
        (1470, 440, 55, 55), # STU2026-028
    ]
    
    students_dir = r"c:\face zip\Face_attendance\backend\uploads\students"
    
    # 8, 15, 22 are absent - do not overlay them
    absent_ids = [8, 15, 22]
    
    for i in range(28):
        num = i + 1
        if num in absent_ids:
            print(f"Student {num:03d} (STU2026-{num:03d}) is Absent. Leaving seat empty.")
            continue
            
        # Determine student profile filename
        if num <= 12:
            filename = f"face_r1_c{num:02d}.jpg"
        elif num <= 24:
            filename = f"face_r2_c{num-12:02d}.jpg"
        else:
            filename = f"face_r3_c{num-24:02d}.jpg"
            
        file_path = os.path.join(students_dir, filename)
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        x, y, w, h = COORDINATES[i]
        
        # Generate avatar
        avatar = create_circular_avatar(file_path, w)
        
        # Paste onto background
        bg.paste(avatar, (x, y), avatar)
        print(f"Overlaid Student {num:03d} (STU2026-{num:03d}) at ({x}, {y})")
        
    out_path_1 = r"c:\face zip\Face_attendance\classroom_sample.png"
    out_path_2 = r"c:\face zip\Face_attendance\backend\uploads\students\classroom_sample.png"
    
    bg.convert("RGB").save(out_path_1, "PNG")
    bg.convert("RGB").save(out_path_2, "PNG")
    print(f"\nSuccessfully generated classroom composite photo at:")
    print(f"  - {out_path_1}")
    print(f"  - {out_path_2}")

if __name__ == "__main__":
    main()
