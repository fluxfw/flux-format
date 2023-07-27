import { flux_import_css } from "../../../flux-style-sheet-manager/src/FluxImportCss.mjs";

/** @typedef {import("../StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

const root_css = await flux_import_css.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatUrlValueElementRoot.css`
);

const css = await flux_import_css.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatUrlValueElement.css`
);

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
            await style_sheet_manager.generateVariableStyleSheet(
                this.name,
                {
                    [`${FLUX_FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX}background-color`]: "background-color",
                    [`${FLUX_FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX}foreground-color`]: "accent-color",
                    [`${FLUX_FORMAT_URL_VALUE_ELEMENT_VARIABLE_PREFIX}outline-color`]: "foreground-color"
                },
                true
            );

            await style_sheet_manager.addStyleSheet(
                root_css,
                true
            );
        } else {
            if (!document.adoptedStyleSheets.includes(root_css)) {
                document.adoptedStyleSheets.unshift(root_css);
            }
        }

        return new this(
            url,
            label,
            title
        );
    }

    /**
     * @param {string} url
     * @param {string | null} label
     * @param {string | null} title
     * @private
     */
    constructor(url, label, title) {
        super();

        const shadow = this.attachShadow({
            mode: "closed"
        });

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
    }
}

export const FLUX_FORMAT_URL_VALUE_ELEMENT_TAG_NAME = "flux-format-url-value";

customElements.define(FLUX_FORMAT_URL_VALUE_ELEMENT_TAG_NAME, FluxFormatUrlValueElement);
