const parser = new DOMParser();

/**
 * @param {string} html
 * @returns HTMLElement
 */
export default function stringToElement(html) {
    const doc = parser.parseFromString(html, "text/html");

    return doc.body.firstChild;
}
