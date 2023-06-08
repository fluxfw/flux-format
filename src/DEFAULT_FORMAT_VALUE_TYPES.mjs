import { FORMAT_VALUE_TYPE_COLOR, FORMAT_VALUE_TYPE_DATE, FORMAT_VALUE_TYPE_DATE_TIME, FORMAT_VALUE_TYPE_EMAIL, FORMAT_VALUE_TYPE_TIME, FORMAT_VALUE_TYPE_URL } from "./FORMAT_VALUE_TYPE.mjs";

/** @typedef {import("./DateTime/DateTimeValue.mjs").DateTimeValue} DateTimeValue */
/** @typedef {import("./Date/DateValue.mjs").DateValue} DateValue */
/** @typedef {import("./Email/EmailValue.mjs").EmailValue} EmailValue */
/** @typedef {import("./Color/FluxFormatColorValueElement.mjs").FluxFormatColorValueElement} FluxFormatColorValueElement */
/** @typedef {import("./Url/FluxFormatUrlValueElement.mjs").FluxFormatUrlValueElement} FluxFormatUrlValueElement */
/** @typedef {import("./formatValue.mjs").formatValue} formatValue */
/** @typedef {import("./Time/TimeValue.mjs").TimeValue} TimeValue */
/** @typedef {import("./Url/UrlValue.mjs").UrlValue} UrlValue */

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/;

export const TIME_PATTERN = /^\d{2}:\d{2}:\d{2}(\.\d+)?$/;

export const TIME_OPTIONAL_SECONDS_PATTERN = /^\d{2}:\d{2}(:\d{2})?(\.\d+)?$/;

export const TIMESTAMP_PATTERN = /^-?\d+(\.\d+)?$/;

/**
 * @param {Date | number | string | null} value
 * @param {boolean | null} string_value_is_local_time_zone
 * @returns {Promise<Date | null>}
 */
export async function valueToDate(value = null, string_value_is_local_time_zone = null) {
    if ((value ?? "") === "") {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    if (typeof value === "number") {
        return new Date(value * 1000);
    }

    if (typeof value === "string" && TIMESTAMP_PATTERN.test(value)) {
        return valueToDate(
            parseFloat(value)
        );
    }

    if (typeof value === "string" && DATE_PATTERN.test(value)) {
        return valueToDate(
            `${value}T${new Date(0).toISOString().split("T")[1].split("Z")[0]}`,
            string_value_is_local_time_zone
        );
    }

    if (typeof value === "string" && TIME_OPTIONAL_SECONDS_PATTERN.test(value)) {
        return valueToDate(
            `${new Date(0).toISOString().split("T")[0]}T${value}`,
            string_value_is_local_time_zone
        );
    }

    return new Date(`${value}${!(string_value_is_local_time_zone ?? false) && !value.toLowerCase().endsWith("Z") ? "Z" : ""}`);
}

/**
 * @param {Date | number | string | null} value
 * @param {boolean | null} string_value_is_local_time_zone
 * @returns {Promise<number | null>}
 */
export async function valueToTimestamp(value = null, string_value_is_local_time_zone = null) {
    if ((value ?? "") === "") {
        return null;
    }

    if (value instanceof Date) {
        return value.getTime() / 1000;
    }

    if (typeof value === "number") {
        return value;
    }

    if (typeof value === "string" && TIMESTAMP_PATTERN.test(value)) {
        return parseFloat(value);
    }

    if (typeof value === "string" && DATE_PATTERN.test(value)) {
        return valueToTimestamp(
            `${value}T${new Date(0).toISOString().split("T")[1].split("Z")[0]}`,
            string_value_is_local_time_zone
        );
    }

    if (typeof value === "string" && TIME_OPTIONAL_SECONDS_PATTERN.test(value)) {
        return valueToTimestamp(
            `${new Date(0).toISOString().split("T")[0]}T${value}`,
            string_value_is_local_time_zone
        );
    }

    return valueToTimestamp(
        new Date(`${value}${!(string_value_is_local_time_zone ?? false) && !value.toLowerCase().endsWith("Z") ? "Z" : ""}`)
    );
}

/**
 * @param {string | null} color
 * @returns {Promise<FluxFormatColorValueElement | string | null>}
 */
export async function formatColorValue(color = null) {
    if ((color ?? "") === "") {
        return color;
    }

    return (await import("./Color/FluxFormatColorValueElement.mjs")).FluxFormatColorValueElement.new(
        color
    );
}

/**
 * @param {DateTimeValue} date_time
 * @returns {Promise<string | null>}
 */
export async function formatDateTimeValue(date_time = null) {
    if (date_time === null || typeof date_time !== "object" || date_time instanceof Date) {
        return formatDateTimeValue(
            {
                "date-time": date_time
            }
        );
    }

    if ((date_time["date-time"] ?? "") === "") {
        return date_time["date-time"];
    }

    return (await valueToDate(
        date_time["date-time"]
    ))
        .toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "medium",
            ...date_time["show-as-utc"] ?? false ? {
                timeZone: "UTC"
            } : null
        });
}

/**
 * @param {DateValue} date
 * @returns {Promise<string | null>}
 */
export async function formatDateValue(date = null) {
    if (date === null || typeof date !== "object" || date instanceof Date) {
        return formatDateValue(
            {
                date
            }
        );
    }

    if ((date.date ?? "") === "") {
        return date.date;
    }

    return (await valueToDate(
        date.date
    ))
        .toLocaleDateString([], {
            dateStyle: "medium",
            ...date["show-as-utc"] ?? false ? {
                timeZone: "UTC"
            } : null
        });
}

/**
 * @param {TimeValue} time
 * @returns {Promise<string | null>}
 */
export async function formatTimeValue(time = null) {
    if (time === null || typeof time !== "object" || time instanceof Date) {
        return formatTimeValue(
            {
                time
            }
        );
    }

    if ((time.time ?? "") === "") {
        return time.time;
    }

    return (await valueToDate(
        time.time
    ))
        .toLocaleTimeString([], {
            timeStyle: "medium",
            ...time["show-as-utc"] ?? false ? {
                timeZone: "UTC"
            } : null
        });
}

/**
 * @param {UrlValue} url
 * @returns {Promise<FluxFormatUrlValueElement | string | null>}
 */
export async function formatUrlValue(url = null) {
    if (url === null || typeof url !== "object") {
        return formatUrlValue(
            {
                url
            }
        );
    }

    if ((url.url ?? "") === "") {
        return url.url ?? null;
    }

    return (await import("./Url/FluxFormatUrlValueElement.mjs")).FluxFormatUrlValueElement.new(
        url.url,
        url.label ?? null,
        url.title ?? null
    );
}

/**
 * @param {EmailValue} email
 * @returns {Promise<FluxFormatUrlValueElement | string | null>}
 */
export async function formatEmailValue(email = null) {
    if (email === null || typeof email !== "object") {
        return formatEmailValue(
            {
                email
            }
        );
    }

    if ((email.email ?? "") === "") {
        return email.email ?? null;
    }

    return formatUrlValue(
        {
            url: `mailto:${email.email}`,
            label: (email.label ?? "") !== "" ? email.label : email.email,
            title: email.title ?? null
        }
    );
}

/**
 * @type {{[key: string]: formatValue}}
 */
export const DEFAULT_FORMAT_VALUE_TYPES = Object.freeze({
    [FORMAT_VALUE_TYPE_COLOR]: formatColorValue,
    [FORMAT_VALUE_TYPE_DATE]: formatDateValue,
    [FORMAT_VALUE_TYPE_DATE_TIME]: formatDateTimeValue,
    [FORMAT_VALUE_TYPE_EMAIL]: formatEmailValue,
    [FORMAT_VALUE_TYPE_TIME]: formatTimeValue,
    [FORMAT_VALUE_TYPE_URL]: formatUrlValue
});
