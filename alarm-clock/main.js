// switch clock
const formatSwitchBtn = document.querySelector(".format-switch-btn");

formatSwitchBtn.addEventListener("click", () => {
  formatSwitchBtn.classList.toggle("active");

  let formatValue = formatSwitchBtn.getAttribute("data-format");

  if (formatValue === "12") {
    formatSwitchBtn.setAttribute("data-format", "24");
  } else {
    formatSwitchBtn.setAttribute("data-format", "12");
  }
});

function clock() {
  let today = new Date();

  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();
  let period = "AM";

  // set time period AM/PM
  if (hours >= 12) {
    period = "PM";
  }

  // set 12 hour clock
  let formatValue = formatSwitchBtn.getAttribute("data-format");

  if (formatValue === '12') {
    hours = hours > 12 ? hours % 12 : hours;
  }

  // add 0 to hours/minutes/seconds less than 10
  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  document.querySelector(".hours").innerHTML = hours;
  document.querySelector(".minutes").innerHTML = minutes;
  document.querySelector(".seconds").innerHTML = seconds;
  document.querySelector(".period").innerHTML = period;
}

let updateClock = setInterval(clock, 1000);

// get the date JS

let today = new Date();
const dayNumber = today.getDate();
const year = today.getFullYear();
const dayName = today.toLocaleString("default", { weekday: "long" });
const monthName = today.toLocaleString("default", { month: "short" });

document.querySelector(".month-name").innerHTML = monthName;
document.querySelector(".day-name").innerHTML = dayName;
document.querySelector(".year").innerHTML = year;
document.querySelector(".day-number").innerHTML = dayNumber;

// dot menu toggle

const dotMenuBtn = document.querySelector(".dot-menu-btn");
const dotMenu = document.querySelector(".dot-menu");

dotMenuBtn.addEventListener("click", () => {
  dotMenu.classList.toggle("active");
});

// Get the reference to the alarm list, alarm time input, and alarm sound elements
const alarmList = document.getElementById("alarmList");
const alarmTimeInput = document.getElementById("alarmTime");
const alarmSound = document.getElementById("alarmSound");

// Array to store alarm objects
let alarms = [];

// Function to set an alarm
function setAlarm() {
    const time = alarmTimeInput.value;
  
    // Splitting the time string to get hours and minutes
    const [hoursStr, minutesStr] = time.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
  
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
      time: time,
      active: true,
      id: new Date().getTime(),
      timeoutId: null,
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
function toggleAlarm(id) {
    const alarm = alarms.find((alarm) => alarm.id === id);
    alarm.active = !alarm.active;
  
    clearTimeout(alarm.timeoutId);
  
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
      // Update the text content of the toggle button to "Turn On"
      const toggleButton = document.querySelector(`.toggle-button`);
      toggleButton.textContent = "Turn On";
      renderAlarms();
    }
}

// Function to delete an alarm
function deleteAlarm(id) {
    // Find the index of the alarm by its ID
    const index = alarms.findIndex((alarm) => alarm.id === id);
  
    // If alarm is found
    if (index !== -1) {
      // Clear the timeout associated with the alarm
      clearTimeout(alarms[index].timeoutId);
  
      // Remove the alarm from the alarms array
      alarms.splice(index, 1);
  
      // Render the updated list of alarms
      renderAlarms();
    }
}

// Function to render the list of alarms
function renderAlarms() {
  // Clear the existing list of alarms
  alarmList.innerHTML = "";

  // Loop through each alarm object and create corresponding HTML elements
  alarms.forEach((alarm) => {
    const alarmItem = document.createElement("div");
    alarmItem.classList.add('alarm-item');

    const timeElement = document.createElement("span");
    timeElement.classList.add("time");
    timeElement.textContent = alarm.time;
    alarmItem.appendChild(timeElement);

    const actionsElement = document.createElement("div");
    actionsElement.classList.add("actions");

    const toggleButton = document.createElement("button");
    toggleButton.textContent = alarm.active ? "Turn Off" : "Turn On";
    toggleButton.classList.add("toggle-button"); // Ensure this line adds the class "toggle-button"
    toggleButton.addEventListener("click", () => toggleAlarm(alarm.id));
    actionsElement.appendChild(toggleButton);

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

