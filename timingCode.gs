function dailycheck(){
  var notice = "= Morning Brief =\n=== Pending ===\n"
  checkAndSendEmail(notice)
}

function newlyApproved(){
  var notice = "New Approval"
  checkAndSendEmail(notice)
}


function timedCheckAndSendToSlack() {
  // Get the active spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the active sheet
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Get the data range in column (APPROVAL column), starting from row 2 to skip the header
  var range = sheet.getRange(2, findColumnByHeader(APPROVAL_HEADER), sheet.getLastRow() - 1, 1); // Column Approval, starting from row 2
  
  // Get the values in the range
  var values = range.getValues();

  // Check if the number of rows in the range is less than 1, then pass
  if (values.length < 1) {
    return;
  }

  // Slack webhook URL
  var slackWebhookUrl = SLACKWEBHOOK_URL;

  // Loop through each row in the range
  for (var i = 0; i < values.length; i++) {
    // Check if the cell value in column  contains 'APPROVED' and has not been posted yet 'POSTED_HEADER'
    if (values[i][0] && values[i][0].toString().toUpperCase() === APPROVAL_TERM && sheet.getRange(i + 2, findColumnByHeader(POSTED_HEADER)).getValue() != 1) {
      // Construct the message for the current item
      var message = "The following extension has been approved:\n\n";
      message += "Full Name: " + sheet.getRange(i + 2, findColumnByHeader(NAME_HEADER)).getValue() + "\n"; // Column 
      message += "Student ID: " + sheet.getRange(i + 2, findColumnByHeader(STUDENT_ID_HEADER)).getValue() + "\n"; // Column
      message += "Assignment: " + sheet.getRange(i + 2, findColumnByHeader(ASSIGNMENT_HEADER)).getValue() + "\n"; // Column  
      message += "Notes: " + sheet.getRange(i + 2, findColumnByHeader(EXTENSION_NOTES)).getValue() + "\n"; // Column 
      message += "Approval: " + values[i][0] + "\n";
      message += "Row: " + (i + 2); // Adding 2 because the data starts from row 2 + "\n";

      // Construct payload for Slack
      var payload = {
        "text": message
      };

      // Send message to Slack
      UrlFetchApp.fetch(slackWebhookUrl, {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
      });

      // Set the posted slack cell to true
      sheet.getRange(i + 2, findColumnByHeader(POSTED_HEADER)).setValue(1);
    }
  }
}


function checkAndSendEmail(notice) {
  // Get the active spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the active sheet
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Get the data range in (APPROVAL column), starting from row 2 to skip the header
  var range = sheet.getRange(2, findColumnByHeader(APPROVAL_HEADER), sheet.getLastRow() - 1, 1); // starting from row 2
  
  // Get the values in the range
  var values = range.getValues();

  // Check if the number of rows in the range is less than 1, then pass
  if (values.length < 1) {
    return;
  }

  // Array to store approved items
  var approvedItems = [];
  
  // Loop through each row in the range
  for (var i = 0; i < values.length; i++) {
    // Check if the cell value contains 'APPROVED'
    if (values[i][0] && values[i][0].toString().toUpperCase() === APPROVAL_TERM) {
      // If 'APPROVED' is found, add details to approvedItems array
      approvedItems.push({
        row: i + 2, // Adding 2 because the data starts from row 2
        assignment: sheet.getRange(i + 2, findColumnByHeader(ASSIGNMENT_HEADER)).getValue(), // Column
        fullName: sheet.getRange(i + 2, findColumnByHeader(NAME_HEADER)).getValue(), // Column
        studentID: sheet.getRange(i + 2, findColumnByHeader(STUDENT_ID_HEADER)).getValue(), // Column
        notes: sheet.getRange(i + 2, findColumnByHeader(EXTENSION_NOTES)).getValue(), // Column
        approval: APPROVAL_TERM // We know this entry is approved
      });
    }
  }
  
  // If there are approved items, send each item as a separate message to Slack
  if (approvedItems.length > 0) {
    // Slack webhook URL
    var slackWebhookUrl = SLACKWEBHOOK_URL;

    // Loop through each approved item
    approvedItems.forEach(function(item) {
      // Construct the message for the current item
      var message = notice + "\n\n";
      message += "Full Name: " + item.fullName + "\n";
      message += "Student ID: " + item.studentID + "\n";
      message += "Assignment: " + item.assignment + "\n";
      message += "Notes: " + item.notes + "\n";
      message += "Approval: " + item.approval + "\n";
      message += "Row: " + item.row + "\n";

      // Construct payload for Slack
      var payload = {
        "text": message
      };

      // Send message to Slack
      UrlFetchApp.fetch(slackWebhookUrl, {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
      });
    });
  } else {
    Logger.log("No "+ APPROVAL_TERM+" items found.");
  }
}
