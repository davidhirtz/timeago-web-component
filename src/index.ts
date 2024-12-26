import {normalizeDates} from "../node_modules/date-fns/_lib/normalizeDates";
import {
    secondsInDay,
    secondsInHour,
    secondsInMinute,
    secondsInMonth,
    secondsInWeek,
    secondsInYear,
} from "date-fns/constants";

import {differenceInCalendarDays} from "date-fns/differenceInCalendarDays";
import {differenceInCalendarMonths} from "date-fns/differenceInCalendarMonths";
import {differenceInCalendarWeeks} from "date-fns/differenceInCalendarWeeks";
import {differenceInCalendarYears} from "date-fns/differenceInCalendarYears";
import {differenceInHours} from "date-fns/differenceInHours";
import {differenceInMinutes} from "date-fns/differenceInMinutes";
import {differenceInSeconds} from "date-fns/differenceInSeconds";

// @ts-ignore
const rtf = new Intl.RelativeTimeFormat(document.documentElement.lang || new Intl.DateTimeFormat().resolvedOptions().locale, {
    numeric: "auto",
});

const intlFormatDistance = (laterDate, earlierDate): string => {
    let value = 0;
    let unit: string;

    const [laterDate_, earlierDate_] = normalizeDates(
        null,
        laterDate,
        earlierDate,
    );

    const diffInSeconds = differenceInSeconds(laterDate_, earlierDate_);

    if (Math.abs(diffInSeconds) < secondsInMinute) {
        value = differenceInSeconds(laterDate_, earlierDate_);
        unit = "second";
    } else if (Math.abs(diffInSeconds) < secondsInHour) {
        value = differenceInMinutes(laterDate_, earlierDate_);
        unit = "minute";
    } else if (Math.abs(diffInSeconds) < secondsInDay &&
        Math.abs(differenceInCalendarDays(laterDate_, earlierDate_)) < 1
    ) {
        value = differenceInHours(laterDate_, earlierDate_);
        unit = "hour";
    } else if (
        Math.abs(diffInSeconds) < secondsInWeek &&
        (value = differenceInCalendarDays(laterDate_, earlierDate_)) &&
        Math.abs(value) < 7
    ) {
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
}

window.customElements.define('x-timeago', class extends HTMLElement {
    t: number | null;
    d: Date;

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        const _ = this;

        try {
            _.d = new Date(_.dataset.date || _.textContent);
        } catch (e) {
            console.error(e);
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
        const now = new Date();
        const diff = Math.abs(now.getTime() - _.d.getTime());

        _.textContent = intlFormatDistance(_.d, now);

        _.t = setTimeout(() => _.set(), diff < 60000 ? 1000 : 60000);
    }
});