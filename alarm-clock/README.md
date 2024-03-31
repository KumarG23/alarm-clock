# alarm-clock

// Define a constant variable "formatSwitchBtn" and select the HTML element with the class "format-switch-btn"
// Add an event listener to the "formatSwitchBtn" element for a click event
// When clicked, toggle the class "active" on the "formatSwitchBtn" element
// Get the value of the "data-format" attribute of the "formatSwitchBtn" element
// If the value is "12", change it to "24", and vice versa

// Define a function named "clock"
// Inside the function:
// - Get the current date and time
// - Extract hours, minutes, and seconds from the date object
// - Set the time period (AM or PM) based on the hour value
// - Get the format value from the "formatSwitchBtn" element
// - If the format is set to 12-hour clock, convert hours to 12-hour format
// - Add leading zeros to single-digit hours, minutes, and seconds
// - Update the HTML elements with the current time and period
// Set an interval to call the "clock" function every second

// Get the current date
// Extract day number, year, day name, and month name from the date object
// Update HTML elements with the extracted date information

// Define variables for the dot menu button and dot menu
// Add an event listener to the dot menu button for a click event
// When clicked, toggle the class "active" on the dot menu

// Get references to HTML elements related to setting alarms (alarm list, alarm time input, and alarm sound)
// Define an empty array "alarms" to store alarm objects

// Define a function named "setAlarm"
// Inside the function:
// - Get the time value from the alarm time input
// - Parse hours and minutes from the time value
// - Create a new Date object for the specified alarm time
// - Calculate the time until the alarm goes off
// - If the specified time is in the past, set the alarm for the next day
// - Create an alarm object with time, active status, unique id, and timeout id
// - Add the alarm object to the "alarms" array
// - Render the updated list of alarms
// - Set a timeout to trigger the alarm

// Define a function named "toggleAlarm" that takes an "id" parameter
// Inside the function:
// - Find the alarm object in the "alarms" array by its id
// - Toggle the active status of the alarm
// - Clear the timeout associated with the alarm
// - If the alarm is active, set a new timeout for the next alarm trigger
// - Otherwise, update the text content of the toggle button to "Turn On"
// - Render the updated list of alarms

// Define a function named "deleteAlarm" that takes an "id" parameter
// Inside the function:
// - Find the index of the alarm in the "alarms" array by its id
// - If the alarm is found, clear the timeout associated with it and remove it from the "alarms" array
// - Render the updated list of alarms

// Define a function named "renderAlarms"
// Inside the function:
// - Clear the existing list of alarms in the HTML
// - Loop through each alarm object in the "alarms" array
//   - Create HTML elements for displaying the alarm time and action buttons
//   - Add event listeners to the toggle and delete buttons
//   - If the alarm is inactive, add a class for styling
//   - Append the alarm elements to the alarm list in the HTML

// Define functions to stop and play the alarm sound
