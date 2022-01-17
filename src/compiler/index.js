/*
  ast 语法树 是用对象来描述原生语法的
  虚拟 DOM 用对象来描述 dom 节点
*/

/*
  匹配双大括号
*/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

import { parseHTML } from './parse-html'

// 处理属性 拼接成属性字符串
// attrs: [{ name: 'id', value: 'app' },{ name: 'style', value: {color: ' red'} }]
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach((item) => {
        let [key, value] = item.split(':')
        obj[key] = value.trim()
      })
      attr.value = obj
    }
    str += `${attr.name}: ${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren(el) {
  const children = el.children
  if (children && children.length) {
    return `${children.map((c) => gen(c)).join(',')}`
  } else {
    return false
  }
}

function gen(node) {
  if (node.type === 1) {
    return generate(node)
  } else {
    // <div>a {{ name }} b {{ age }} c</div>
    const text = node.text
    let tokens = []
    let match, index
    let lastIndex = (defaultTagRE.lastIndex = 0)

    while ((match = defaultTagRE.exec(text))) {
      index = match.index
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    return `_v(${tokens.join('+')})`
  }
}

function generate(el) {
  const children = genChildren(el)

  let code = `_c("${el.tag}",
      ${el.attrs.length ? genProps(el.attrs) : undefined}
      ${children ? `,${children}` : ''}
    )
  `

  return code
}

export function compileToFunction(template) {
  // 解析 html 字符串，将html字符串 -> ast 语法树
  const root = parseHTML(template)
  // 需要将 ast 语法树生成最终的render函数 就是字符串拼接
  const code = generate(root)
  // 所有的模版引擎的实现 都需要 new Function + with
  const renderFn = new Function(`with(this){ return ${code} }`)

  return renderFn
}
