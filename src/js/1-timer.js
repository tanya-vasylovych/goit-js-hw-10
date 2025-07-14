import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('button[data-start]');

let userSelectedDate = null;
let timerId = null;

const daysData = document.querySelector("[data-days]");
const hoursData = document.querySelector("[data-hours]");
const minuteData = document.querySelector("[data-minutes]");
const secondsData = document.querySelector("[data-seconds]");

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates.length === 0) {
      startButton.disabled = true;
      userSelectedDate = null;
      return;
    }
    const selectedDate = selectedDates[0];
    const now = Date.now();
    if (selectedDate.getTime() <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysData.textContent = days; // дні без провідних нулів
  hoursData.textContent = pad(hours);
  minuteData.textContent = pad(minutes);
  secondsData.textContent = pad(seconds);
}

function resetTimer() {
  daysData.textContent = "00";
  hoursData.textContent = "00";
  minuteData.textContent = "00";
  secondsData.textContent = "00";
}

startButton.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  datetimePicker.disabled = true;

  timerId = setInterval(() => {
    const now = Date.now();
    const diff = userSelectedDate.getTime() - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false;
      // Кнопка залишається неактивною, поки не виберуть нову дату
      return;
    }

    const time = convertMs(diff);
    updateTimer(time);
  }, 1000);

  // Початкове оновлення таймера одразу після старту
  const initialDiff = userSelectedDate.getTime() - Date.now();
  if (initialDiff > 0) {
    updateTimer(convertMs(initialDiff));
  }
});

// Для перевірки функції convertMs
console.log(convertMs(2000));      // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000));    // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000));  // {days: 0, hours: 6, minutes: 42, seconds: 20}

