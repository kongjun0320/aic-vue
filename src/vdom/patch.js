export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    const oldElm = oldVnode // <div id = 'app'>
    const parentElm = oldElm.parentNode // body

    const el = createElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)

    parentElm.removeChild(oldElm)
  }
}

function createElm(vnode) {
  const { tag, children, key, data, text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach((child) => {
      return vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode) {
  let newProps = vnode.data
  let el = vnode.el

  for (const key in newProps) {
    if (key === 'style') {
      for (const styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
