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
let alarmList = document.getElementById("alarmList");
let alarmTimeInput = document.getElementById("alarmTime");
let alarmSound = document.getElementById("alarmSound");

// Array to store alarm objects
let alarms = [];

let alarmIdCounter =1;

let snoozeDuration = 120000; // snooze set to 2 minutes

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
    if (timeUntilAlarm < 0) { // checks if alarm has already passed
      alarmTime.setDate(alarmTime.getDate() + 1); // sets time for alarm to next day
      timeUntilAlarm = alarmTime - now; // recalculate time until alarm
    }
  
    // Creating an alarm object with time, active status, unique id, and timeout id
    const alarm = {
      time: time, // stores time for alarm to trigger
      active: true, // represents alarm is active. default true. 
      id: alarmIdCounter++, // this gives each alarm an id starting with alarm1 and counting upward.
      timeoutId: null, // store timeout id for alarm. default null
      alarmTime: alarmTime, // Store the alarm time for reference
    };
  
    // Adding the alarm object to the alarms array
    alarms.push(alarm);
  
    // Rendering the updated list of alarms
    renderAlarms();
  
    // Set the timeout to trigger the alarm
    alarm.timeoutId = setTimeout(() => { // set timer to execute function
      playAlarmSound(); // when timer ends play alarm sound
      renderAlarms(); // after timer plays update list of alarms
      alarm.timeoutId = setTimeout(() => {
        playAlarmSound();
        renderAlarms();
      } ,snoozeDuration);
    }, timeUntilAlarm); // determines how long after timer the function will execute
}    
    

// Function to toggle an alarm
function toggleAlarm(id) { // toggle alarm w/ id parameter
  const alarm = alarms.find((alarm) => alarm.id === id); // find method to find alarm in array with specified id
  alarm.active = !alarm.active; // changes boolean between true and not(!) true.
  
  clearTimeout(alarm.timeoutId); // cancels the alarm.timeoutId
  
  if (alarm.active) { // checks if alarm is active
    const now = new Date(); // creates new date object
    const alarmTime = new Date(now.toDateString() + " " + alarm.time); // new date object representing when the alarm should go off
    const timeUntilAlarm = alarmTime - now; // time from when the alarm should go off from now
    alarm.timeoutId = setTimeout(() => { // sets timeout function
      playAlarmSound(); // play alarm sound
      alarm.active = false; // changes the alarm to false
      renderAlarms(); // updates the alarm list
    }, timeUntilAlarm); 
  } else {
    // Update the text content of the toggle button
    console.log('turning alarm off');
    const toggleButton = document.querySelector(`#toggle-${id}`); // selects toggle button with the toggle buttons specific id
    toggleButton.textContent = "Turn Off"; // changes text content to turn off
  }
renderAlarms(); // had to move this outside of the else block so that text could change back to turn on. :/
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

function snoozeAlarm(id) {
    const alarm = alarms.find((alarm) => alarm.id === id);
    clearTimeout(alarm.timeoutId); // Clear the existing timeout
    
    const newAlarmTime = new Date(alarm.alarmTime.getTime() + snoozeDuration);
    alarm.alarmTime = newAlarmTime;

    
    alarm.timeoutId = setTimeout(() => {
        playAlarmSound();
        renderAlarms(); // update alarms list
    }, snoozeDuration);

    console.log("updated value of alarmTime:", newAlarmTime);



    // Render the alarms with the updated time
    renderAlarms();
}


// Function to render the list of alarms
function renderAlarms() {
  // Clear existing list of alarms
  alarmList.innerHTML = "";

  // Loop through each alarm object and create corresponding HTML elements
  alarms.forEach((alarm) => {
    const alarmItem = document.createElement("div"); // container for alarmItems
    alarmItem.classList.add('alarm-item'); // class for styling

    const timeElement = document.createElement("span"); //creates a span element of timeElement
    timeElement.classList.add("time"); // gives it a class for styling
    timeElement.textContent = alarm.time; // sets the text content of the element to the alarm time
    alarmItem.appendChild(timeElement); // big box = alarmItem, smaller box inside big box = timeElement

    const actionsElement = document.createElement("div"); // creates a div container to hold actions
    actionsElement.classList.add("actions");

    const toggleButton = document.createElement('button'); // create a button for the toggle
    toggleButton.classList.add("toggle-button"); // class for styling
    toggleButton.id = `toggle-${alarm.id}`; // set button's id dynamically
    toggleButton.textContent = alarm.active ? "Turn Off" : "Turn On"; // Change button text based on active status
    toggleButton.addEventListener("click", () => toggleAlarm(alarm.id)); // Change event to button click
    actionsElement.appendChild(toggleButton); // big box = actions element, little box inside of big box = toggleButton

    const snoozeButton = document.createElement('button');
    snoozeButton.classList.add('snooze.button');
    snoozeButton.textContent = 'Snooze';
    snoozeButton.addEventListener('click', () => snoozeAlarm(alarm.id));
    actionsElement.appendChild(snoozeButton);

    const deleteButton = document.createElement('button'); // create a button for delete
    deleteButton.classList.add('delete.button'); // add class for styling, i ended up just using gg-trash so not sure if this is needed
    deleteButton.innerHTML = '<span class="gg-trash"></span>'; // i made the trash button a trash can, linked in html
    deleteButton.addEventListener("click", () => deleteAlarm(alarm.id)); // when clicked delete alarm with specific id
    actionsElement.appendChild(deleteButton); // big box = actionsElement, little box inside of big box = deleteButton

    alarmItem.appendChild(actionsElement); // big box = alarmItem, smaller box = actionsElement, even smaller box = buttons etc. 

    // If the alarm is inactive, add a class to the alarm item for styling
    if (!alarm.active) {
      alarmItem.classList.add('inactive-alarm');
    }
    
    // Append the alarm item to the alarm list
    alarmList.appendChild(alarmItem); // alarmList holds all the alarms, alarmItem is a single alarm, appendChild appends the alarmItem to the alarmList. Even bigger box. 
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


