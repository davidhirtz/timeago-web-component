(() => {
  // node_modules/date-fns/constants.js
  var daysInYear = 365.2425;
  var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
  var minTime = -maxTime;
  var millisecondsInWeek = 6048e5;
  var millisecondsInDay = 864e5;
  var millisecondsInMinute = 6e4;
  var millisecondsInHour = 36e5;
  var secondsInHour = 3600;
  var secondsInMinute = 60;
  var secondsInDay = secondsInHour * 24;
  var secondsInWeek = secondsInDay * 7;
  var secondsInYear = secondsInDay * daysInYear;
  var secondsInMonth = secondsInYear / 12;
  var secondsInQuarter = secondsInMonth * 3;
  var constructFromSymbol = Symbol.for("constructDateFrom");

  // node_modules/date-fns/constructFrom.js
  function constructFrom(date, value) {
    if (typeof date === "function") return date(value);
    if (date && typeof date === "object" && constructFromSymbol in date)
      return date[constructFromSymbol](value);
    if (date instanceof Date) return new date.constructor(value);
    return new Date(value);
  }

  // node_modules/date-fns/_lib/normalizeDates.js
  function normalizeDates(context, ...dates) {
    const normalize = constructFrom.bind(
      null,
      context || dates.find((date) => typeof date === "object")
    );
    return dates.map(normalize);
  }

  // node_modules/date-fns/toDate.js
  function toDate(argument, context) {
    return constructFrom(context || argument, argument);
  }

  // node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
  function getTimezoneOffsetInMilliseconds(date) {
    const _date = toDate(date);
    const utcDate = new Date(
      Date.UTC(
        _date.getFullYear(),
        _date.getMonth(),
        _date.getDate(),
        _date.getHours(),
        _date.getMinutes(),
        _date.getSeconds(),
        _date.getMilliseconds()
      )
    );
    utcDate.setUTCFullYear(_date.getFullYear());
    return +date - +utcDate;
  }

  // node_modules/date-fns/startOfDay.js
  function startOfDay(date, options) {
    const _date = toDate(date, options?.in);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }

  // node_modules/date-fns/differenceInCalendarDays.js
  function differenceInCalendarDays(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(
      options?.in,
      laterDate,
      earlierDate
    );
    const laterStartOfDay = startOfDay(laterDate_);
    const earlierStartOfDay = startOfDay(earlierDate_);
    const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
    const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
    return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
  }

  // node_modules/date-fns/differenceInCalendarMonths.js
  function differenceInCalendarMonths(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(
      options?.in,
      laterDate,
      earlierDate
    );
    const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
    const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();
    return yearsDiff * 12 + monthsDiff;
  }

  // node_modules/date-fns/_lib/defaultOptions.js
  var defaultOptions = {};
  function getDefaultOptions() {
    return defaultOptions;
  }

  // node_modules/date-fns/startOfWeek.js
  function startOfWeek(date, options) {
    const defaultOptions2 = getDefaultOptions();
    const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
    const _date = toDate(date, options?.in);
    const day = _date.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    _date.setDate(_date.getDate() - diff);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }

  // node_modules/date-fns/differenceInCalendarWeeks.js
  function differenceInCalendarWeeks(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(
      options?.in,
      laterDate,
      earlierDate
    );
    const laterStartOfWeek = startOfWeek(laterDate_, options);
    const earlierStartOfWeek = startOfWeek(earlierDate_, options);
    const laterTimestamp = +laterStartOfWeek - getTimezoneOffsetInMilliseconds(laterStartOfWeek);
    const earlierTimestamp = +earlierStartOfWeek - getTimezoneOffsetInMilliseconds(earlierStartOfWeek);
    return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInWeek);
  }

  // node_modules/date-fns/differenceInCalendarYears.js
  function differenceInCalendarYears(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(
      options?.in,
      laterDate,
      earlierDate
    );
    return laterDate_.getFullYear() - earlierDate_.getFullYear();
  }

  // node_modules/date-fns/_lib/getRoundingMethod.js
  function getRoundingMethod(method) {
    return (number) => {
      const round = method ? Math[method] : Math.trunc;
      const result = round(number);
      return result === 0 ? 0 : result;
    };
  }

  // node_modules/date-fns/differenceInHours.js
  function differenceInHours(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(
      options?.in,
      laterDate,
      earlierDate
    );
    const diff = (+laterDate_ - +earlierDate_) / millisecondsInHour;
    return getRoundingMethod(options?.roundingMethod)(diff);
  }

  // node_modules/date-fns/differenceInMilliseconds.js
  function differenceInMilliseconds(laterDate, earlierDate) {
    return +toDate(laterDate) - +toDate(earlierDate);
  }

  // node_modules/date-fns/differenceInMinutes.js
  function differenceInMinutes(dateLeft, dateRight, options) {
    const diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInMinute;
    return getRoundingMethod(options?.roundingMethod)(diff);
  }

  // node_modules/date-fns/differenceInSeconds.js
  function differenceInSeconds(laterDate, earlierDate, options) {
    const diff = differenceInMilliseconds(laterDate, earlierDate) / 1e3;
    return getRoundingMethod(options?.roundingMethod)(diff);
  }

  // src/index.ts
  var rtf = new Intl.RelativeTimeFormat(document.documentElement.lang || new Intl.DateTimeFormat().resolvedOptions().locale, {
    numeric: "auto"
  });
  var intlFormatDistance = (laterDate, earlierDate) => {
    let value = 0;
    let unit;
    const [laterDate_, earlierDate_] = normalizeDates(
      null,
      laterDate,
      earlierDate
    );
    const diffInSeconds = differenceInSeconds(laterDate_, earlierDate_);
    if (Math.abs(diffInSeconds) < secondsInMinute) {
      value = differenceInSeconds(laterDate_, earlierDate_);
      unit = "second";
    } else if (Math.abs(diffInSeconds) < secondsInHour) {
      value = differenceInMinutes(laterDate_, earlierDate_);
      unit = "minute";
    } else if (Math.abs(diffInSeconds) < secondsInDay && Math.abs(differenceInCalendarDays(laterDate_, earlierDate_)) < 1) {
      value = differenceInHours(laterDate_, earlierDate_);
      unit = "hour";
    } else if (Math.abs(diffInSeconds) < secondsInWeek && (value = differenceInCalendarDays(laterDate_, earlierDate_)) && Math.abs(value) < 7) {
      unit = "day";
    } else if (Math.abs(diffInSeconds) < secondsInMonth) {
      value = differenceInCalendarWeeks(laterDate_, earlierDate_);
      unit = "week";
    } else if (Math.abs(diffInSeconds) < secondsInYear) {
      value = differenceInCalendarMonths(laterDate_, earlierDate_);
      unit = "month";
    } else {
      value = differenceInCalendarYears(laterDate_, earlierDate_);
      unit = "year";
    }
    return rtf.format(value, unit);
  };
  window.customElements.define("x-timeago", class extends HTMLElement {
    t;
    d;
    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
      const _ = this;
      _.d = new Date(_.dataset.date || _.textContent);
      if (_.d.toString() === "Invalid Date") {
        return;
      }
      if (!_.title) {
        _.title = _.d.toLocaleString(rtf.locale);
      }
      _.set();
    }
    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
      clearTimeout(this.t);
    }
    set() {
      const _ = this;
      const now = /* @__PURE__ */ new Date();
      const diff = Math.abs(now.getTime() - _.d.getTime());
      _.textContent = intlFormatDistance(_.d, now);
      _.t = setTimeout(() => _.set(), diff < 6e4 ? 1e3 : 6e4);
    }
  });
})();
