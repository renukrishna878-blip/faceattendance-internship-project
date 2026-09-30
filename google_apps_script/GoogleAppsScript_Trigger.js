/**
 * Google Apps Script - Automated Student Registration Webhook Trigger
 * 
 * Instructions:
 * 1. Open your Google Form's linked Google Sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any default code and paste this entire script.
 * 4. Update BACKEND_WEBHOOK_URL and API_KEY if needed.
 * 5. Click the Clock icon (Triggers) on the left sidebar:
 *    - Click "+ Add Trigger" (bottom right).
 *    - Choose function: "onFormSubmitTrigger".
 *    - Event source: "From spreadsheet".
 *    - Event type: "On form submit".
 *    - Click "Save" and authorize permissions.
 */

// ===================== CONFIGURATION =====================
// If using local dev with ngrok or local network IP, enter it here.
// Example: "https://your-ngrok-url.ngrok-free.app/api/students/google-form-register"
// Or institutional server: "http://attendance.campus.edu:5000/api/students/google-form-register"
var BACKEND_WEBHOOK_URL = "http://localhost:5000/api/students/google-form-register";
var API_KEY = "smart_attend_gf_sec_2026_x9k";

/**
 * Triggered automatically whenever a student submits the Google Form.
 */
function onFormSubmitTrigger(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var row = e ? e.range.getRow() : sheet.getLastRow();
    
    // Ensure "Registration Status" column exists in header row
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var statusColIdx = headers.indexOf("Registration Status") + 1;
    if (statusColIdx === 0) {
      statusColIdx = sheet.getLastColumn() + 1;
      sheet.getRange(1, statusColIdx).setValue("Registration Status");
    }

    // Set initial status to PROCESSING in Google Sheet
    sheet.getRange(row, statusColIdx).setValue("PROCESSING...");

    // Extract submission values from namedValues or row
    var rowValues = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
    var record = {};
    for (var i = 0; i < headers.length; i++) {
      var headerName = String(headers[i]).trim();
      record[headerName] = rowValues[i];
    }

    // Map form fields flexibly
    var studentId = getFieldValue(record, ["Student ID", "Register Number", "Reg No", "student_id"]);
    var name = getFieldValue(record, ["Student Name", "Name", "name", "Full Name"]);
    var department = getFieldValue(record, ["Department", "Dept", "department"]);
    var classSection = getFieldValue(record, ["Class/Section", "Class", "Section", "Year & Section", "class_section"]);
    var email = getFieldValue(record, ["Email", "Email Address", "email"]);
    var consent = getFieldValue(record, ["Consent/acknowledgement", "Consent", "Acknowledgement", "consent"]);
    var photoUrl = getFieldValue(record, ["Face Photograph", "Face Photo", "Photograph", "Upload Photo", "face_photo"]);

    if (!studentId || !name) {
      sheet.getRange(row, statusColIdx).setValue("FAILED: Missing Student ID or Name");
      return;
    }

    // Extract photo blob as base64 from Google Drive
    var base64Photo = "";
    if (photoUrl) {
      base64Photo = getDriveFileAsBase64(photoUrl);
    }

    if (!base64Photo) {
      sheet.getRange(row, statusColIdx).setValue("FAILED: INVALID_FACE (No photo or unreadable file)");
      return;
    }

    // Prepare payload for Express backend
    var payload = {
      student_id: String(studentId).trim(),
      name: String(name).trim(),
      department: String(department || "General").trim(),
      class_section: String(classSection || "I-A").trim(),
      email: String(email || "").trim(),
      consent: consent || "Yes",
      face_photo: base64Photo
    };

    var options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "X-API-KEY": API_KEY
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    Logger.log("Dispatching student " + studentId + " to backend webhook...");
    var response = UrlFetchApp.fetch(BACKEND_WEBHOOK_URL, options);
    var statusCode = response.getResponseCode();
    var responseText = response.getContentText();
    var resData = {};
    try {
      resData = JSON.parse(responseText);
    } catch (parseErr) {
      resData = { error: responseText };
    }

    Logger.log("Backend response [" + statusCode + "]: " + responseText);

    // Update status column in Google Sheet
    if (statusCode === 201 && resData.success) {
      sheet.getRange(row, statusColIdx).setValue("REGISTERED - VERIFIED (SFace)");
      sheet.getRange(row, statusColIdx).setBackground("#D1FAE5").setFontColor("#065F46"); // Light green
    } else {
      var failureReason = resData.status || resData.error || "FAILED";
      sheet.getRange(row, statusColIdx).setValue("FAILED: " + failureReason);
      sheet.getRange(row, statusColIdx).setBackground("#FEE2E2").setFontColor("#991B1B"); // Light red
    }

  } catch (err) {
    Logger.log("Trigger Exception: " + err.toString());
    if (sheet && row && statusColIdx) {
      sheet.getRange(row, statusColIdx).setValue("ERROR: " + err.message);
    }
  }
}

/**
 * Helper: Find matching field value from possible column aliases
 */
function getFieldValue(record, aliases) {
  for (var i = 0; i < aliases.length; i++) {
    var key = aliases[i];
    if (record[key] !== undefined && record[key] !== null && String(record[key]).trim() !== "") {
      return record[key];
    }
    // Also try case-insensitive check
    for (var rKey in record) {
      if (rKey.toLowerCase() === key.toLowerCase() && String(record[rKey]).trim() !== "") {
        return record[rKey];
      }
    }
  }
  return "";
}

/**
 * Helper: Fetch Google Drive file blob and return as Base64 string
 */
function getDriveFileAsBase64(fileUrlOrId) {
  try {
    var fileId = "";
    var str = String(fileUrlOrId);
    
    // Match Google Drive file ID from URL formats
    var match = str.match(/[-\w]{25,}/);
    if (match) {
      fileId = match[0];
    } else {
      fileId = str;
    }

    var file = DriveApp.getFileById(fileId);
    var blob = file.getBlob();
    var contentType = blob.getContentType() || "image/jpeg";
    var bytes = blob.getBytes();
    var base64Data = Utilities.base64Encode(bytes);

    return "data:" + contentType + ";base64," + base64Data;
  } catch (e) {
    Logger.log("Error reading Drive file: " + e.toString());
    return null;
  }
}
