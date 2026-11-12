import { canonicalUrl } from "./site-url"

function setMetaName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute("name", name)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute("property", property)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", "canonical")
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

export function setPageMeta(options: {
  title: string
  description: string
  pathname: string
  robots?: string
}) {
  document.title = options.title
  setMetaName("description", options.description)
  setCanonical(canonicalUrl(options.pathname))
  setMetaProperty("og:title", options.title)
  setMetaProperty("og:description", options.description)
  setMetaProperty("og:url", canonicalUrl(options.pathname))
  if (options.robots) {
    setMetaName("robots", options.robots)
  }
}
