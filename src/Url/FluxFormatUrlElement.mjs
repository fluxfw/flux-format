import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";

flux_css_api.adopt(
    document,
    await flux_css_api.import(
        `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatUrlElementVariables.css`
    ),
    true
);

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatUrlElement.css`
);

export class FluxFormatUrlElement extends HTMLElement {
    /**
     * @param {string} url
     * @param {string | null} label
     * @returns {FluxFormatUrlElement}
     */
    static new(url, label) {
        return new this(
            url,
            label ?? url
        );
    }

    /**
     * @param {string} url
     * @param {string} label
     * @private
     */
    constructor(url, label) {
        super();

        const shadow = this.attachShadow({
            mode: "closed"
        });

        flux_css_api.adopt(
            shadow,
            css
        );

        const link_element = document.createElement("a");
        link_element.href = url;
        link_element.innerText = label;
        link_element.rel = "noopener noreferrer";
        link_element.target = "__blank";
        shadow.appendChild(link_element);
    }
}

export const FLUX_FORMAT_URL_ELEMENT_TAG_NAME = "flux-format-url";

customElements.define(FLUX_FORMAT_URL_ELEMENT_TAG_NAME, FluxFormatUrlElement);
