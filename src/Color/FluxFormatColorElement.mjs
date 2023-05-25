import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";

flux_css_api.adopt(
    document,
    await flux_css_api.import(
        `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatColorElementVariables.css`
    ),
    true
);

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatColorElement.css`
);

export class FluxFormatColorElement extends HTMLElement {
    /**
     * @param {string} color
     * @returns {FluxFormatColorElement}
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

        flux_css_api.adopt(
            shadow,
            css
        );

        const color_element = document.createElement("div");
        color_element.classList.add("color");
        color_element.style.setProperty("--flux-format-color-color", color);
        shadow.appendChild(color_element);

        const text_element = document.createElement("div");
        text_element.classList.add("text");
        text_element.innerText = color;
        shadow.appendChild(text_element);
    }
}

export const FLUX_FORMAT_COLOR_ELEMENT_TAG_NAME = "flux-format-color";

customElements.define(FLUX_FORMAT_COLOR_ELEMENT_TAG_NAME, FluxFormatColorElement);
