function getTranslation(item) {
    const translation = item.querySelector(".translation__item__phrase .translation").textContent.trim()
    const phraseSummary = [...item.querySelectorAll(".phrase__summary__field")].map(item => item.textContent.trim())
    const definitions = [...item.querySelectorAll(".translation__definition")].map(item => {
        return {
            language: item.querySelector(".translation__definition__language").textContent.trim(),
            definition: item.querySelector("span:last-child").innerHTML.trim(),
        }
    })
    const examples = [...item.querySelectorAll(".translation__example")].map(item => {
        return {
            source: item.querySelector("p:first-child").innerHTML,
            target: item.querySelector("p:last-child").innerHTML,
        }
    })
    return { translation, phraseSummary, definitions, examples }
}

async function fetchFromGlosbe(phrase, source, target) {
    return await fetch(`https://glosbe.com/${source}/${target}/${phrase}`).then(res => res.text())
}

function parseResponse(html) {
    let body = null

    if (typeof window === "undefined") {
        const { JSDOM } = require("jsdom")
        body = new JSDOM(html).window.document.body
    } else {
        const parser = new DOMParser()
        parser.parseFromString(html).body
    }

    const list = body.querySelector(".translations__list")
    const items = [...list.querySelectorAll(".translation__item")].map(item => getTranslation(item))
    return items
}

export default async function translate(phrase, source, target) {
    const html = await fetchFromGlosbe(phrase, source, target)
    const result = parseResponse(html)
    return result
}

async function main() {
    console.dir(await translate("by and large", "en", "cs"), { depth: null })
}

main()
