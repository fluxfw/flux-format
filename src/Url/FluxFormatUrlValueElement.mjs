import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";

const variables_css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatUrlValueElementVariables.css`
);

document.adoptedStyleSheets.unshift(variables_css);

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FluxFormatUrlValueElement.css`
);

export class FluxFormatUrlValueElement extends HTMLElement {
    /**
     * @param {string} url
     * @param {string | null} label
     * @param {string | null} title
     * @returns {FluxFormatUrlValueElement}
     */
    static new(url, label = null, title = null) {
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
        shadow.appendChild(link_element);
    }
}

export const FLUX_FORMAT_URL_VALUE_ELEMENT_TAG_NAME = "flux-format-url-value";

customElements.define(FLUX_FORMAT_URL_VALUE_ELEMENT_TAG_NAME, FluxFormatUrlValueElement);
