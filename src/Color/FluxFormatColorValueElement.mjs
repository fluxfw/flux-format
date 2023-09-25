import { flux_import_css } from "../../../flux-style-sheet-manager/src/FluxImportCss.mjs";

/** @typedef {import("../StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

const root_css = await flux_import_css.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatColorValueElementRoot.css`
);

const css = await flux_import_css.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatColorValueElement.css`
);

export const FLUX_FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX = "--flux-format-color-value-";

export class FluxFormatColorValueElement extends HTMLElement {
    /**
     * @param {string} color
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FluxFormatColorValueElement>}
     */
    static async new(color, style_sheet_manager = null) {
        if (style_sheet_manager !== null) {
            await style_sheet_manager.generateVariablesRootStyleSheet(
                this.name,
                {
                    [`${FLUX_FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX}background-color`]: "background-color",
                    [`${FLUX_FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX}color`]: "foreground-color",
                    [`${FLUX_FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX}foreground-color`]: "foreground-color"
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

        const flux_format_color_value_element = new this();

        const shadow = flux_format_color_value_element.attachShadow({
            mode: "closed"
        });

        await style_sheet_manager?.addStyleSheetsToShadow(
            shadow
        );

        shadow.adoptedStyleSheets.push(css);

        const color_element = document.createElement("div");
        color_element.classList.add("color");
        color_element.style.setProperty(`${FLUX_FORMAT_COLOR_VALUE_ELEMENT_VARIABLE_PREFIX}color`, color);
        shadow.append(color_element);

        const text_element = document.createElement("div");
        text_element.classList.add("text");
        text_element.innerText = color;
        shadow.append(text_element);

        return flux_format_color_value_element;
    }

    /**
     * @private
     */
    constructor() {
        super();
    }
}

export const FLUX_FORMAT_COLOR_VALUE_ELEMENT_TAG_NAME = "flux-format-color-value";

customElements.define(FLUX_FORMAT_COLOR_VALUE_ELEMENT_TAG_NAME, FluxFormatColorValueElement);
