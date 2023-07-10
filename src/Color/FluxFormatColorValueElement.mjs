import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";

const root_css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatColorValueElementRoot.css`
);

document.adoptedStyleSheets.unshift(root_css);

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatColorValueElement.css`
);

export class FluxFormatColorValueElement extends HTMLElement {
    /**
     * @param {string} color
     * @returns {FluxFormatColorValueElement}
     */
    static new(color) {
        return new this(
            color
        );
    }

    /**
     * @param {string} color
     * @private
     */
    constructor(color) {
        super();

        const shadow = this.attachShadow({
            mode: "closed"
        });

        shadow.adoptedStyleSheets.push(css);

        const color_element = document.createElement("div");
        color_element.classList.add("color");
        color_element.style.setProperty("--flux-format-color-value-color", color);
        shadow.append(color_element);

        const text_element = document.createElement("div");
        text_element.classList.add("text");
        text_element.innerText = color;
        shadow.append(text_element);
    }
}

export const FLUX_FORMAT_COLOR_VALUE_ELEMENT_TAG_NAME = "flux-format-color-value";

customElements.define(FLUX_FORMAT_COLOR_VALUE_ELEMENT_TAG_NAME, FluxFormatColorValueElement);
