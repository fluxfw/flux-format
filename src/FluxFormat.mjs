import { FORMAT_TYPE_COLOR, FORMAT_TYPE_EMAIL, FORMAT_TYPE_TEXT, FORMAT_TYPE_URL } from "./FORMAT_TYPE.mjs";

/** @typedef {import("./formatValue.mjs").formatValue} formatValue */

export class FluxFormat {
    /**
     * @type {Map<string, formatValue>}
     */
    #formats;

    /**
     * @returns {FluxFormat}
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
        switch (type ?? FORMAT_TYPE_TEXT) {
            case FORMAT_TYPE_COLOR:
                if ((value ?? "") !== "") {
                    return (await import("./Color/FluxFormatColorElement.mjs")).FluxFormatColorElement.new(
                        value
                    );
                } else {
                    return this.formatValue(
                        value,
                        FORMAT_TYPE_TEXT
                    );
                }

            case FORMAT_TYPE_EMAIL:
                if ((value ?? "") !== "") {
                    return (await import("./Url/FluxFormatUrlElement.mjs")).FluxFormatUrlElement.new(
                        `mailto:${value}`,
                        value
                    );
                } else {
                    return this.formatValue(
                        value,
                        FORMAT_TYPE_TEXT
                    );
                }

            case FORMAT_TYPE_TEXT:
                return `${(value ?? "") !== "" ? value : "-"}`;

            case FORMAT_TYPE_URL:
                if ((value ?? "") !== "") {
                    return (await import("./Url/FluxFormatUrlElement.mjs")).FluxFormatUrlElement.new(
                        value
                    );
                } else {
                    return this.formatValue(
                        value,
                        FORMAT_TYPE_TEXT
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
