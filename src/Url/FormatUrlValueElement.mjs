import css from "./FormatUrlValueElement.css" with { type: "css" };
import root_css from "./FormatUrlValueElementRoot.css" with { type: "css" };

/** @typedef {import("../StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export const FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX = "--format-url-value-";

export class FormatUrlValueElement extends HTMLElement {
    /**
     * @param {string} url
     * @param {string | null} label
     * @param {string | null} title
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FormatUrlValueElement>}
     */
    static async new(url, label = null, title = null, style_sheet_manager = null) {
        if (style_sheet_manager !== null) {
            await style_sheet_manager.generateVariablesRootStyleSheet(
                FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX,
                {
                    [`${FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX}background-color`]: "background-color",
                    [`${FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX}foreground-color`]: "accent-color",
                    [`${FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX}outline-color`]: "foreground-color"
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

        const format_url_value_element = new this();

        const shadow = format_url_value_element.attachShadow({
            mode: "closed"
        });

        await style_sheet_manager?.addStyleSheetsToShadow(
            shadow
        );

        shadow.adoptedStyleSheets.push(css);

        const link_element = document.createElement("a");
        link_element.href = url;
        link_element.innerText = (label ?? "") !== "" ? label : url;
        link_element.rel = "noopener noreferrer";
        link_element.target = "__blank";
        if ((title ?? "") !== "") {
            link_element.title = title;
        }
        shadow.append(link_element);

        return format_url_value_element;
    }

    /**
     * @private
     */
    constructor() {
        super();
    }
}

export const FORMAT_URL_VALUE_ELEMENT_TAG_NAME = "format-url-value";

customElements.define(FORMAT_URL_VALUE_ELEMENT_TAG_NAME, FormatUrlValueElement);
