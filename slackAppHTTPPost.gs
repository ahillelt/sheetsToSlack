function doPost(e) {

  // Log the entire event payload for review
  Logger.log("Received payload: " + e.postData.contents);

  var payload = JSON.parse(e.postData.contents);

  // Store the payload in the 'URL' sheet for review
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_LOG);
  //sheet.appendRow(["Received payload: " + e.postData.contents]);

  // Check if the challenge field exists in the payload
  if (payload.hasOwnProperty('challenge')) {
    // Log the challenge for tracking
    Logger.log("Challenge received: " + payload.challenge);
    //sheet.appendRow(["Challenge received: " + payload.challenge]);
    
    // Respond with the challenge value
    return ContentService.createTextOutput(payload.challenge);
  } else {
    // Get the channel and message TS from the payload
    var channel = payload.event.item.channel;
    var messageTs = payload.event.item.ts;
    var reaction = payload.event.reaction;

    // Log the channel and message TS
    Logger.log("Channel: " + channel + ", Message TS: " + messageTs);
    //sheet.appendRow(["Channel: " + channel + ", Message TS: " + messageTs]);

    // Make the HTTP request to Slack API
    var url = SLACK_API_URL;
    var options = {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + SLACK_TOKEN
      },
      payload: {
        channel: channel,
        latest: messageTs,
        inclusive: true,
        limit: 1
      }
    };
    Logger.log("Making HTTP request to: " + url);
    //sheet.appendRow(["Making HTTP request to: " + url]);
    var response = UrlFetchApp.fetch(url, options);
    Logger.log("Received HTTP response");
    //sheet.appendRow(["Received HTTP response"]);
    var history = JSON.parse(response.getContentText());

    // Check if the API call was successful
    if (history.ok) {
      // Get the message contents
      var messageContents = history.messages[0].text;

      // Log the message contents for review
      Logger.log("Message contents: " + messageContents);
      //sheet.appendRow(["Message contents: " + messageContents]);


    
    // Extract row values from the message contents
        // Check if the added reaction is white_check_mark
    if (reaction === EMOTICON_TYPE) {
      var rowValues = messageContents.match(/Row: (\d+)/g).map(function(val) {
        return val.replace('Row: ', '');
      });

      // Log the row values for review
      Logger.log("Row values: " + rowValues.join(', '));
      //sheet.appendRow(["Row values: " + rowValues.join(', ')]);

      // Store the row values in the 'URL' sheet
      //rowValues.forEach(function(row) {
      //  sheet.appendRow([row]);
      //});

      /// Call the function after extracting the row values
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var logSheet = spreadsheet.getSheetByName(SHEET_LOG);
      var dataSheet = spreadsheet.getSheetByName(SHEET_NAME);
      processRows(logSheet, dataSheet, rowValues);


    }

    } 
    
    
    else {
      // Log the error
      Logger.log("Error getting message history: " + history.error);
      //sheet.appendRow(["Error getting message history: " + history.error]);
    }

    // Respond to Slack (optional)
    return ContentService.createTextOutput("Event received.").setMimeType(ContentService.MimeType.TEXT);
  }
}
