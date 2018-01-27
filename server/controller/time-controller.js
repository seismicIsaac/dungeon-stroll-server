const NEW_GAME_DAY = 1;
const NEW_GAME_TIME = 700;
const TIME_COST_TURNING = 15;
const TIME_COST_NORMAL = 100;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 2400;
const DECIMAL_PLACES = 2;

class TimeController {

  adjustTimeOfDay(dateTime, isTurning) {
    dateTime.time += isTurning ? TIME_COST_TURNING : TIME_COST_NORMAL;
    Object.assign(dateTime, this.incrementHoursOrDays(dateTime));
    Number((dateTime.time).toFixed(DECIMAL_PLACES));
    return dateTime;
  }

  incrementHoursOrDays(dateTime) {
    let time = dateTime.time;
    let day = dateTime.day

    if (time % 100 >= MINUTES_IN_HOUR) {
      time += 100;
      time -= MINUTES_IN_HOUR;
    }

    if (time > HOURS_IN_DAY) {
      time -= HOURS_IN_DAY;
      day++;
    }
    return { time: time, day: day };
  }

  getNewGameDateTime() {
    return {
      day: NEW_GAME_DAY,
      time: NEW_GAME_TIME
    }
  }
}

module.exports = TimeController;