import { DEFAULT_FORMAT_VALUE_TYPES } from "./DEFAULT_FORMAT_VALUE_TYPES.mjs";

/** @typedef {import("./formatValue.mjs").formatValue} formatValue */
/** @typedef {import("./StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export class FluxValueFormat {
    /**
     * @type {Map<string, formatValue>}
     */
    #format_values;
    /**
     * @type {StyleSheetManager | null}
     */
    #style_sheet_manager;

    /**
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FluxValueFormat>}
     */
    static async new(style_sheet_manager = null) {
        const flux_value_format = new this(
            style_sheet_manager
        );

        for (const [
            type,
            format_value
        ] of Object.entries(DEFAULT_FORMAT_VALUE_TYPES)) {
            await flux_value_format.addFormatValue(
                type,
                format_value
            );
        }

        return flux_value_format;
    }

    /**
     * @param {StyleSheetManager | null} style_sheet_manager
     * @private
     */
    constructor(style_sheet_manager) {
        this.#style_sheet_manager = style_sheet_manager;
        this.#format_values = new Map();
    }

    /**
     * @param {string} type
     * @param {formatValue} format_value
     * @returns {Promise<void>}
     */
    async addFormatValue(type, format_value) {
        if (this.#format_values.has(type)) {
            throw new Error(`Format value type ${type} already exists!`);
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
                throw new Error(`Unknown format value type ${type}!`);
            }

            formatted_value = await format_value(
                value,
                this.#style_sheet_manager
            ) ?? null;

        } else {
            formatted_value = value;
        }

        return typeof Node !== "undefined" && formatted_value instanceof Node ? formatted_value : `${(formatted_value ?? "") !== "" ? formatted_value : "-"}`;
    }
}
