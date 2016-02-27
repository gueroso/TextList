# TextList
Using Amazon Alexa to text you to-do list reminders at scheduled times & dates

## How to Use:

1. Tell Alexa to "Text me (task description) at Time & Date"
2. You will receive a text message at the specified time/date from a Twilio phone number
3. You must then respond to Alexa by responding to the text message. If you do not do so, she will remind you to complete the task every fifteen minutes via text
  - Text back with the any of the words "complete, completed, done, accomplished" to let her know to delete the task from your list
  - If you cannot complete the task at that moment, simply respond with "postpone until (specified date & time / amount of time)" and she will send you a reminder text at the new time

Technologies Used:
- [Amazon Alexa](https://alexa.amazon.com)
- [Firebase](https://www.firebase.com)
- [Twilio](https://www.twilio.com)
- [Node.js](https://www.nodejs.org)
