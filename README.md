Alon Hillel-Tuch
----------------
A simple Google Apps Script repo to handle communication between Slack and Google Sheets/Forms.
----------------

I coded this in order to better manage Homework extension requests made by my students. A Google form would be created with an assigned Google Sheet. 
This code is configured to be part of the Google Sheet. 

Whenever the instructor approves a homework extension request (made by student via Google form). It automatically posts a message to a private Slack channel for course assistants to action (adjust dates etc). 
Once a course assistant attaches  specific white checkmark on a green background emoticon to the Slack message. A Slack event trigger posts to the URL of the G Apps Script which removes it from the pending queue. 

This is highly tailored code for a specific need. However, it is designed to be easily modified for anyone with similar needs. 

You must create multiple Slack apps assigned with the scopes for your use case. For the code to function as intended you will need two time-based Triggers in Apps Script. One to call 'dailycheck' every 24-hours, and another to call 'timedCheckAndSendToSlack' at your desired frequency. 

It is highly recommended you store any tokens and private variables in a vault or other Secrets solution and not directly in code. 
