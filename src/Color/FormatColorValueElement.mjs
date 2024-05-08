import css from "./FormatColorValueElement.css" with { type: "css" };
import root_css from "./FormatColorValueElementRoot.css" with { type: "css" };

/** @typedef {import("../StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export const FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX = "--format-color-value-";

export class FormatColorValueElement extends HTMLElement {
    /**
     * @param {string} color
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FormatColorValueElement>}
     */
    static async new(color, style_sheet_manager = null) {
        if (style_sheet_manager !== null) {
            await style_sheet_manager.generateVariablesRootStyleSheet(
                FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX,
                {
                    [`${FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX}background-color`]: "background-color",
                    [`${FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX}color`]: "foreground-color",
                    [`${FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX}foreground-color`]: "foreground-color"
                },
                true
            );

            await style_sheet_manager.addRootStyleSheet(
                root_css,
                true
            );
        } else {
            if (!document.adoptedStyleSheets.includes(root_css)) {
                document.adoptedStyleSheets.unshift(root_css);
            }
        }

        const format_color_value_element = new this();

        const shadow = format_color_value_element.attachShadow({
            mode: "closed"
        });

        await style_sheet_manager?.addStyleSheetsToShadow(
            shadow
        );

        shadow.adoptedStyleSheets.push(css);

        const color_element = document.createElement("div");
        color_element.classList.add("color");
        color_element.style.setProperty(`${FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX}color`, color);
        shadow.append(color_element);

        const text_element = document.createElement("div");
        text_element.classList.add("text");
        text_element.innerText = color;
        shadow.append(text_element);

        return format_color_value_element;
    }

    /**
     * @private
     */
    constructor() {
        super();
    }
}

export const FORMAT_COLOR_VALUE_ELEMENT_TAG_NAME = "format-color-value";

customElements.define(FORMAT_COLOR_VALUE_ELEMENT_TAG_NAME, FormatColorValueElement);
