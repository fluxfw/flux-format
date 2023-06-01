import { FORMAT_VALUE_TYPE_COLOR, FORMAT_VALUE_TYPE_EMAIL, FORMAT_VALUE_TYPE_URL } from "./FORMAT_VALUE_TYPE.mjs";

/** @typedef {import("./Email/EmailValue.mjs").EmailValue} EmailValue */
/** @typedef {import("./Color/FluxFormatColorValueElement.mjs").FluxFormatColorValueElement} FluxFormatColorValueElement */
/** @typedef {import("./Url/FluxFormatUrlValueElement.mjs").FluxFormatUrlValueElement} FluxFormatUrlValueElement */
/** @typedef {import("./formatValue.mjs").formatValue} formatValue */
/** @typedef {import("./Url/UrlValue.mjs").UrlValue} UrlValue */

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
    [FORMAT_VALUE_TYPE_EMAIL]: formatEmailValue,
    [FORMAT_VALUE_TYPE_URL]: formatUrlValue
});
