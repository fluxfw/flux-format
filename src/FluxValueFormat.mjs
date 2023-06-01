import { DEFAULT_FORMAT_VALUE_TYPES } from "./DEFAULT_FORMAT_VALUE_TYPES.mjs";

/** @typedef {import("./formatValue.mjs").formatValue} formatValue */

export class FluxValueFormat {
    /**
     * @type {Map<string, formatValue>}
     */
    #format_values;

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
        this.#format_values = new Map();

        for (const [
            type,
            format_value
        ] of Object.entries(DEFAULT_FORMAT_VALUE_TYPES)) {
            this.addFormatValue(
                type,
                format_value
            );
        }
    }

    /**
     * @param {string} type
     * @param {formatValue} format_value
     * @returns {void}
     */
    addFormatValue(type, format_value) {
        if (this.#format_values.has(type)) {
            throw new Error(`Format value type ${type} already exists`);
        }

        this.#format_values.set(type, format_value);
    }

    /**
     * @param {*} value
     * @param {string | null} type
     * @returns {Promise<Node | string>}
     */
    async formatValue(value = null, type = null) {
        let formatted_value;

        if ((type ?? "") !== "") {
            const format_value = this.#format_values.get(type) ?? null;

            if (format_value === null) {
                throw new Error(`Unknown format value type ${type}`);
            }

            formatted_value = await format_value(
                value
            ) ?? null;

        } else {
            formatted_value = value;
        }

        return typeof Node !== "undefined" && formatted_value instanceof Node ? formatted_value : `${(formatted_value ?? "") !== "" ? formatted_value : "-"}`;
    }
}
