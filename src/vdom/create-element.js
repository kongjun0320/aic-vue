export function createELement(tag, data = {}, ...children) {
  const key = data.key
  if (key) {
    delete data.key
  }
  return vnode(tag, data, key, children, undefined)
}
export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}

/*
  将 template 转换成 ast语法树 -> 生成 render 方法 ->  生成虚拟dom -> 真实 dom
*/
