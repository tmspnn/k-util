import Class from "./Class.js";
import CustomEventEmitter from "./CustomEventEmitter.js";
import stringToElement from "./stringToElement.js";

export const viewEventEmitter = new CustomEventEmitter();

export const View = Class({
    displayName: "CustomClass [[ View ]]",

    eventEmitter: viewEventEmitter,

    /**
     * @type {null | HTMLElement}
     */
    element: null,

    /**
     * @type {Record<string, HTMLElement>}
     */
    refs: {},

    /**
     * @param {string | HTMLElement} strOrEl
     */
    init(strOrEl) {
        if (typeof strOrEl == "string") {
            this.element = stringToElement(strOrEl);
        } else if (typeof strOrEl == "object") {
            this.element = strOrEl;
        } else {
            throw new TypeError(`View.init(strOrEl: string | HTMLElement) does not recognize ${String(strOrEl)}.`);
        }

        this.refs = {self: this.element};

        this.traverse(this.element)

        return this;
    },

    /**
     * @param {HTMLElement} el
     */
    traverse(el) {
        if (el.hasAttribute("data-ref")) {
            const refName = el.getAttribute("data-ref");
            this.refs[refName] = el;
        }

        if (el.hasAttribute("data-click")) {
            const method = el.getAttribute("data-click");

            if (typeof this[method] == "function") {
                el.addEventListener("click", this[method]);
            }
        }

        if (el.hasAttribute("data-on")) {
            const pairs = el.getAttribute("data-on").split(";");

            pairs.forEach((pair) => {
                const p = pair.split(":").map((txt) => txt.trim());
                const e = p[0];
                const h = p[1];

                if (typeof this[h] == "function") {
                    el.addEventListener(e, this[h]);
                }
            });
        }

        for (var i = 0; i < el.children.length; ++i) {
            const ch = el.children[i];

            if (!ch.hasAttribute("data-view")) {
                this.traverse(ch);
            }
        }
    },

    destroy() {
        if (document.body.contains(this.element)) {
            this.element.parentNode.removeChild(this.element);
        }

        this.element = null;
        this.refs = {};
    }
})
