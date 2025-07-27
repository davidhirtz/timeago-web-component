import {normalizeDates} from "../node_modules/date-fns/_lib/normalizeDates";
import {
    secondsInDay,
    secondsInHour,
    secondsInMinute,
    secondsInMonth,
    secondsInWeek,
    secondsInYear,
} from "../node_modules/date-fns/constants";

import {differenceInCalendarDays} from "../node_modules/date-fns/differenceInCalendarDays";
import {differenceInCalendarMonths} from "../node_modules/date-fns/differenceInCalendarMonths";
import {differenceInCalendarWeeks} from "../node_modules/date-fns/differenceInCalendarWeeks";
import {differenceInCalendarYears} from "../node_modules/date-fns/differenceInCalendarYears";
import {differenceInHours} from "../node_modules/date-fns/differenceInHours";
import {differenceInMinutes} from "../node_modules/date-fns/differenceInMinutes";
import {differenceInSeconds} from "../node_modules/date-fns/differenceInSeconds";
import {DateArg} from "../node_modules/date-fns/types";

const rtf = new Intl.RelativeTimeFormat(document.documentElement.lang || new Intl.DateTimeFormat().resolvedOptions().locale, {
    numeric: "auto",
});

const intlFormatDistance = (laterDate: DateArg<Date>, earlierDate: DateArg<Date>): string => {
    let value = 0;
    let unit: string;

    const [laterDate_, earlierDate_] = normalizeDates(
        undefined,
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

    return rtf.format(value, unit as Intl.RelativeTimeFormatUnit);
}

const tag = 'x-timeago';

customElements.get(tag) || customElements.define(tag, class extends HTMLElement {
    #timeout: number;
    #date: Date;

    static get observedAttributes() {
        return ['date'];
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        this.#setDate();
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        clearTimeout(this.#timeout!);
    }

    // noinspection JSUnusedGlobalSymbols
    attributeChangedCallback() {
        this.#setDate()
    }

    #setDate() {
        const _ = this;
        _.#date = new Date(_.getAttribute('date') || _.textContent || Date.now());

        if (_.#date.toString() === 'Invalid Date') {
            return;
        }

        if (!_.title) {
            _.title = _.#date.toLocaleString(rtf.resolvedOptions().locale);
        }

        this.#updateTime();
    }

    #updateTime() {
        const _ = this;
        const now = new Date();
        const diff = Math.abs(now.getTime() - _.#date.getTime());

        _.textContent = intlFormatDistance(_.#date, now);

        _.#timeout = setTimeout(() => _.#updateTime(), diff < 60000 ? 1000 : 60000);
    }
});