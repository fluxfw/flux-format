import { VALUE_FORMAT_TYPE_COLOR, VALUE_FORMAT_TYPE_EMAIL, VALUE_FORMAT_TYPE_TEXT, VALUE_FORMAT_TYPE_URL } from "./VALUE_FORMAT_TYPE.mjs";

/** @typedef {import("./formatValue.mjs").formatValue} formatValue */

export class FluxValueFormat {
    /**
     * @type {Map<string, formatValue>}
     */
    #formats;

    /**
     * @returns {FluxValueFormat}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {
        this.#formats = new Map();
    }

    /**
     * @param {string} type
     * @param {formatValue} format_value
     * @returns {void}
     */
    addFormat(type, format_value) {
        this.#formats.set(type, format_value);
    }

    /**
     * @param {*} value
     * @param {string | null} type
     * @returns {Promise<string | Node>}
     */
    async formatValue(value = null, type = null) {
        switch (type ?? VALUE_FORMAT_TYPE_TEXT) {
            case VALUE_FORMAT_TYPE_COLOR:
                if ((value ?? "") !== "") {
                    return (await import("./Color/FluxValueFormatColorElement.mjs")).FluxValueFormatColorElement.new(
                        value
                    );
                } else {
                    return this.formatValue(
                        value,
                        VALUE_FORMAT_TYPE_TEXT
                    );
                }

            case VALUE_FORMAT_TYPE_EMAIL:
                if (value === null || typeof value !== "object") {
                    return this.formatValue(
                        {
                            email: value
                        },
                        VALUE_FORMAT_TYPE_EMAIL
                    );
                }

                if ((value.email ?? "") !== "") {
                    return (await import("./Url/FluxValueFormatUrlElement.mjs")).FluxValueFormatUrlElement.new(
                        `mailto:${value.email}`,
                        (value.label ?? "") !== "" ? value.label : value.email,
                        value.title ?? null
                    );
                } else {
                    return this.formatValue(
                        value.email,
                        VALUE_FORMAT_TYPE_TEXT
                    );
                }

            case VALUE_FORMAT_TYPE_TEXT:
                return `${(value ?? "") !== "" ? value : "-"}`;

            case VALUE_FORMAT_TYPE_URL:
                if (value === null || typeof value !== "object") {
                    return this.formatValue(
                        {
                            url: value
                        },
                        VALUE_FORMAT_TYPE_URL
                    );
                }

                if ((value.url ?? "") !== "") {
                    return (await import("./Url/FluxValueFormatUrlElement.mjs")).FluxValueFormatUrlElement.new(
                        value.url,
                        value.label ?? null,
                        value.title ?? null
                    );
                } else {
                    return this.formatValue(
                        value.url,
                        VALUE_FORMAT_TYPE_TEXT
                    );
                }

            default: {
                let format_value;

                if (!this.#formats.has(type) || (format_value = this.#formats.get(type) ?? null) === null) {
                    throw new Error(`Unknown format type ${type}`);
                }

                return format_value(
                    value
                );
            }
        }
    }

    /**
     * @param {HTMLElement} element
     * @param {*} value
     * @param {string | null} type
     * @returns {Promise<void>}
     */
    async formatValueToElement(element, value = null, type = null) {
        const formatted_value = await this.formatValue(
            value,
            type
        );

        if (formatted_value instanceof Node) {
            element.appendChild(formatted_value);
        } else {
            element.innerText = formatted_value;
        }
    }
}
