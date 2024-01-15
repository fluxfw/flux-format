import css from "./FluxFormatUrlValueElement.css" with { type: "css" };
import root_css from "./FluxFormatUrlValueElementRoot.css" with { type: "css" };

/** @typedef {import("../StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export const FLUX_FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX = "--flux-format-url-value-";

export class FluxFormatUrlValueElement extends HTMLElement {
    /**
     * @param {string} url
     * @param {string | null} label
     * @param {string | null} title
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FluxFormatUrlValueElement>}
     */
    static async new(url, label = null, title = null, style_sheet_manager = null) {
        if (style_sheet_manager !== null) {
            await style_sheet_manager.generateVariablesRootStyleSheet(
                FLUX_FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX,
                {
                    [`${FLUX_FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX}background-color`]: "background-color",
                    [`${FLUX_FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX}foreground-color`]: "accent-color",
                    [`${FLUX_FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX}outline-color`]: "foreground-color"
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

        const flux_format_url_value_element = new this();

        const shadow = flux_format_url_value_element.attachShadow({
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

        return flux_format_url_value_element;
    }

    /**
     * @private
     */
    constructor() {
        super();
    }
}

export const FLUX_FORMAT_URL_VALUE_ELEMENT_TAG_NAME = "flux-format-url-value";

customElements.define(FLUX_FORMAT_URL_VALUE_ELEMENT_TAG_NAME, FluxFormatUrlValueElement);
