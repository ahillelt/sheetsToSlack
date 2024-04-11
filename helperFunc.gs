//get column info
function findColumnByHeader(headerName) {
  // Get the active spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the active sheet
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Get the headers in the first row
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Find the index of the column that has the specified header
  var columnIndex = headers.indexOf(headerName) + 1; // Adding 1 because columns are 1-indexed
  
  return columnIndex;
}

// A column test function to call 
function testcolumn(){
// Test the function
var headerName = APPROVAL_HEADER;
var columnIndex = findColumnByHeader(headerName);
Logger.log("The column number for '" + headerName + "' is: " + columnIndex);
}


// Function to process and switch terms between APPROVAL_TERM and PROCESSED_TERM
function processRows(logSheet, dataSheet, rowValues) {
  // Iterate over each row value
  for (var i = 0; i < rowValues.length; i++) {
    // Convert the row value to a number (subtract 1 because rows are 0-indexed)
    var rowNumber = Number(rowValues[i]) - 1;

    // Get the cell in approval for the current row
    var cell = dataSheet.getRange(rowNumber + 1, findColumnByHeader(APPROVAL_HEADER));

    // Get the value in the cell
    var cellValue = cell.getValue();

    // Log the initial cell value for review
    Logger.log("Initial cell value for row " + rowValues[i] + ": " + cellValue);
    //logSheet.appendRow(["Initial cell value for row " + rowValues[i] + ": " + cellValue]);

    // Check if the cell value is 'APPROVED'
    if (cellValue.toString().toUpperCase() === APPROVAL_TERM) {
      // Modify the cell value to 'PROCESSED'
      cell.setValue(PROCESSED_TERM);
    }

    // Log the modified cell value for review
    Logger.log("Modified cell value for row " + rowValues[i] + ": " + cell.getValue());
    //logSheet.appendRow(["Modified cell value for row " + rowValues[i] + ": " + cell.getValue()]);
  }
}

function listConversations() {

  // Make the HTTP request to Slack API
  var url = SLACK_CONVERSATION_URL;
  var options = {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + SLACK_TOKEN,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    payload: {
      types: 'private_channel'
    }
  };
  var response = UrlFetchApp.fetch(url, options);
  var conversations = JSON.parse(response.getContentText());

  // Check if the API call was successful
  if (conversations.ok) {
    // Log the conversations for review
    Logger.log("Conversations: " + JSON.stringify(conversations));
    
    // Store the conversations in the designated sheet for review
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(SHEET_LOG);
    //sheet.appendRow([JSON.stringify(conversations)]);
  } else {
    // Log the error
    Logger.log("Error getting conversations: " + conversations.error);
    //sheet.appendRow(["Error getting conversations: " + conversations.error]);
  }
}
