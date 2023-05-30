import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";

const variables_css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxValueFormatColorElementVariables.css`
);

document.adoptedStyleSheets.unshift(variables_css);

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxValueFormatColorElement.css`
);

export class FluxValueFormatColorElement extends HTMLElement {
    /**
     * @param {string} color
     * @returns {FluxValueFormatColorElement}
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
        color_element.style.setProperty("--flux-value-format-color-color", color);
        shadow.appendChild(color_element);

        const text_element = document.createElement("div");
        text_element.classList.add("text");
        text_element.innerText = color;
        shadow.appendChild(text_element);
    }
}

export const FLUX_VALUE_FORMAT_COLOR_ELEMENT_TAG_NAME = "flux-value-format-color";

customElements.define(FLUX_VALUE_FORMAT_COLOR_ELEMENT_TAG_NAME, FluxValueFormatColorElement);
