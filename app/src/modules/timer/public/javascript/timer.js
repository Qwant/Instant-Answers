/**
 * returns time from seconds
 * @param timeInSec
 * @returns {string}
 */
var secondToTime = function (timeInSec) {
    var hours = Math.floor(timeInSec / 3600);
    if (hours < 10) hours = "0" + hours;
    var minutes = Math.floor((timeInSec % 3600) / 60);
    if (minutes < 10) minutes = "0" + minutes;
    var seconds = timeInSec % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return hours + 'h : ' + minutes + 'm : ' + seconds + 's';
};

// get several DOM elements
var display = document.getElementById("ia__timer__display");
var startTime = document.getElementById("ia__timer__startTime").value;
var triggerButton = document.getElementById('ia__timer__button--toggle');

var currentTime = startTime;
var status = 'stop';
if (timer) clearInterval(timer);
if (beepInterval) clearInterval(beepInterval);
var timer;
var beepInterval;
var audio_context, oscillator;

display.value = secondToTime(startTime);

// On click on the trigger button, change its label to PAUSE/PLAY
$i('ia__timer__button--toggle').onclick = function () {
    if (status === 'stop') {
        triggerButton.innerHTML = '{{= _("PAUSE","timer") }}';
        updateTimer();
    } else {
        triggerButton.innerHTML = '{{= _("PLAY","timer") }}';
        minuterOff();
    }
};

// On click on the reset button, change the trigger button label back to PLAY
$i('ia__timer__button--reset').onclick = function () {
    triggerButton.style.display = 'inline-block';
    triggerButton.innerHTML = '{{= _("PLAY","timer") }}';
    currentTime = startTime;
    stopOscillatorInterval();
    minuterOff();
};

// updates the timer every second
var updateTimer = function () {
    status = 'play';
    timer = setInterval(function () {
        if (currentTime > 0) {
            currentTime--;
        } else {
            triggerButton.style.display = 'none';
            beep();
            beepInterval = setInterval(beep, 1000);
            minuterOff();
        }
        display.value = secondToTime(currentTime);
    }, 1000);
};

// stops the timer
var minuterOff = function () {
    status = 'stop';
    display.value = secondToTime(currentTime);
    if (timer) clearInterval(timer);
};

// stops the Oscillator
var stopOscillatorInterval = function () {
    if (beepInterval) {
        clearInterval(beepInterval);
        oscillator.stop(0);
    }
};

// starts a beeping sound
var beep = function () {
    try {
        audio_context = new (window.AudioContext || window.webkitAudioContext);
        oscillator = audio_context.createOscillator();
        oscillator.frequency.value = 3000;
        oscillator.connect(audio_context.destination);
        oscillator.start(0);
        setTimeout(function () {
            oscillator.stop(0);
        }, 500);
    } catch (e) {
    }
};