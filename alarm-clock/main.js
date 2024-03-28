// Select the clock format switch button
const formatSwitchBtn = document.querySelector(".format-switch-btn");

// Add event listener to toggle clock format
formatSwitchBtn.addEventListener("click", () => {
  // Toggle active class for styling
  formatSwitchBtn.classList.toggle("active");

  // Get the current clock format from data attribute
  let formatValue = formatSwitchBtn.getAttribute("data-format");

  // Toggle between 12-hour and 24-hour format
  if (formatValue === "12") {
    formatSwitchBtn.setAttribute("data-format", "24");
  } else {
    formatSwitchBtn.setAttribute("data-format", "12");
  }
});

// Function to update the clock display
function clock() {
  // Get current date and time
  let today = new Date(); // creates new date object according to system clock
  let hours = today.getHours(); // retrieves hour from today date object
  let minutes = today.getMinutes(); // retrieves minutes from today object
  let seconds = today.getSeconds(); // retrieves seconds from today object
  let period = "AM"; // initialize period variable

  // Set time period to AM or PM
  if (hours >= 12) {
    period = "PM";
  }

  // Get the clock format from the switch button
  let formatValue = formatSwitchBtn.getAttribute("data-format");

  // Convert hours to 12-hour format if required
  if (formatValue === '12') { // checks if formatValue is === to 12
    hours = hours > 12 ? hours % 12 : hours; // If the current hour is greater than 12 (i.e., in the afternoon or evening),
    // adjust the hour to be within the 1-12 range by taking the remainder of
    // the current hour divided by 12(staying in 12 hour format). Otherwise, keep the hour unchanged.
  }

  // Add leading zeros to hours, minutes, and seconds if necessary
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // Update the clock display
  document.querySelector(".hours").innerHTML = hours;
  document.querySelector(".minutes").innerHTML = minutes;
  document.querySelector(".seconds").innerHTML = seconds;
  document.querySelector(".period").innerHTML = period;
}

// Call the clock function every second to update the display
let updateClock = setInterval(clock, 1000);

// Get the current date
let today = new Date(); // creates new date object representing system clock
const dayNumber = today.getDate(); // retrieves day of the month from date object
const year = today.getFullYear(); // retrieves year from date object
const dayName = today.toLocaleString("default", { weekday: "long" }); // retrieves day of the week from date oject, formats to full day name
const monthName = today.toLocaleString("default", { month: "short" }); // retrieves month from date object, formats to short version

// Update the date display
document.querySelector(".month-name").innerHTML = monthName;
document.querySelector(".day-name").innerHTML = dayName;
document.querySelector(".year").innerHTML = year;
document.querySelector(".day-number").innerHTML = dayNumber;

// Toggle dot menu
const dotMenuBtn = document.querySelector(".dot-menu-btn");
const dotMenu = document.querySelector(".dot-menu");

dotMenuBtn.addEventListener("click", () => {
  dotMenu.classList.toggle("active");
});

// Get references to alarm-related elements
const alarmList = document.getElementById("alarmList");
const alarmTimeInput = document.getElementById("alarmTime");
const alarmSound = document.getElementById("alarmSound");

// Array to store alarm objects
let alarms = [];

// Function to set an alarm
function setAlarm() {
    const time = alarmTimeInput.value;
  
    // Splitting the time string to get hours and minutes. ex. "9:30" hours=09 minutes=30 allowing you to work w/ them separately.
    const [hoursStr, minutesStr] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
  
    // Adjust hours for 12-hour format if necessary
    const formatValue = formatSwitchBtn.getAttribute("data-format"); // retrieves 'data-format' from html
    if (formatValue === '12') { // checks if format is set to 12 hour
        const period = alarmTimeInput.value.slice(-2).toUpperCase(); //extracts last 2 characters to identify am/pm and converts touppercase
        if (period === 'PM' && hours < 12) { // if pm add 12 to hours for 24 format
            hours += 12;
        } else if (period === 'AM' && hours === 12) { // if am and 12 sets hours to 0 for 24 format (midnight)
            hours = 0;
        }
    }

    // Creating a new Date object with the current date and the specified alarm time
    const now = new Date();
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  
    // Calculating the time until the alarm goes off
    let timeUntilAlarm = alarmTime - now;
  
    // If the specified time is earlier than the current time, set the alarm for the next day
    if (timeUntilAlarm < 0) {
      alarmTime.setDate(alarmTime.getDate() + 1);
      timeUntilAlarm = alarmTime - now;
    }
  
    // Creating an alarm object with time, active status, unique id, and timeout id
    const alarm = {
      time: time, // stores time for alarm to trigger
      active: true, // represents alarm is active. default true. 
      id: new Date().getTime(), // gives alarm unique identifier. finds milliseconds since 1/1/1970
      timeoutId: null, // store timeout id for alarm. default null
      alarmTime: alarmTime, // Store the alarm time for reference
    };
  
    // Adding the alarm object to the alarms array
    alarms.push(alarm);
  
    // Rendering the updated list of alarms
    renderAlarms();
  
    // Set the timeout to trigger the alarm
    alarm.timeoutId = setTimeout(() => {
      playAlarmSound();
      renderAlarms();
    }, timeUntilAlarm);
}

// Function to toggle an alarm
function toggleAlarm(id) { // toggle alarm w/ id parameter
  const alarm = alarms.find((alarm) => alarm.id === id); // find method to find alarm in array with specified id
  alarm.active = !alarm.active; // changes boolean between true and not(!) true.
  
  clearTimeout(alarm.timeoutId); // cancels the alarm.timeoutId
  
  if (alarm.active) {
    const now = new Date();
    const alarmTime = new Date(now.toDateString() + " " + alarm.time);
    const timeUntilAlarm = alarmTime - now;
    alarm.timeoutId = setTimeout(() => {
      playAlarmSound();
      alarm.active = false;
      renderAlarms();
    }, timeUntilAlarm);
  } else {
    // Update the text content of the toggle button
    const toggleButton = document.querySelector(`#toggle-${id}`);
    toggleButton.textContent = "Turn On";
    renderAlarms();
  }
}

// Function to delete an alarm
function deleteAlarm(id) {
  // Find index of the alarm by its ID
  const index = alarms.findIndex((alarm) => alarm.id === id);
  
  // If alarm is found
  if (index !== -1) {
    // Clear timeout associated with the alarm
    clearTimeout(alarms[index].timeoutId);
  
    // Remove alarm from alarms array
    alarms.splice(index, 1);
  
    // Render updated list of alarms
    renderAlarms();
  }
}

// Function to render the list of alarms
function renderAlarms() {
  // Clear existing list of alarms
  alarmList.innerHTML = "";

  // Loop through each alarm object and create corresponding HTML elements
  alarms.forEach((alarm) => {
    const alarmItem = document.createElement("div");
    alarmItem.classList.add('alarm-item');

    const timeElement = document.createElement("span");
    timeElement.classList.add("time");
    timeElement.textContent = alarm.time;
    alarmItem.appendChild(timeElement); //append as a child to actions element

    const actionsElement = document.createElement("div");
    actionsElement.classList.add("actions");

    const toggleButton = document.createElement("label"); // Create label for toggle button
    toggleButton.classList.add("toggle-button"); // Add class for styling
    toggleButton.setAttribute('for', `toggle-${alarm.id}`); // Set for attribute to link with input
    actionsElement.appendChild(toggleButton);

    // Create input element for toggle
    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = alarm.active;
    toggleInput.id = `toggle-${alarm.id}`; // Set id for input
    toggleInput.addEventListener("change", () => toggleAlarm(alarm.id));
    actionsElement.appendChild(toggleInput);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteAlarm(alarm.id));
    actionsElement.appendChild(deleteButton);

    alarmItem.appendChild(actionsElement);

    // If the alarm is inactive, add a class to the alarm item for styling
    if (!alarm.active) {
      alarmItem.classList.add('inactive-alarm');
    }
    
    // Append the alarm item to the alarm list
    alarmList.appendChild(alarmItem);
  });
}

// Function to stop the alarm sound
function stopAlarmSound() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

// Function to play the alarm sound
function playAlarmSound(){
  alarmSound.play();
}


