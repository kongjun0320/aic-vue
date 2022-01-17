// a-0a
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
/*
  ?: -> 匹配不捕获
  (?:${ncname}\\:)  ?    ${ncname}
  <aa:ba>
*/
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
/*
  标签开头的正则
*/
const startTagOpen = new RegExp(`^<${qnameCapture}`)
/*
  结束标签
*/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
/*
  匹配属性
*/
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
/*
  匹配标签结束
  */
const startTagClose = /^\s*(\/?)>/
/*
  匹配双大括号
*/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

let root // ast 语法树的树根
let currentParent // 标识当前的父亲
const stack = []
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}

function start(tagName, attrs) {
  // console.log(`开始标签: ${tagName}, 属性是: ${JSON.stringify(attrs)}`)
  const element = createASTElement(tagName, attrs)
  if (!root) {
    root = element
  }
  currentParent = element
  stack.push(element)
}
function chars(text) {
  // console.log(`文本是: ${text}`)
  text = text.replace(/\s/g, '')
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE
    })
  }
}
function end(tagName) {
  // console.log(`结束标签: ${tagName}`)
  const element = stack.pop()
  currentParent = stack[stack.length - 1]

  if (currentParent) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}

export function parseHTML(html) {
  while (html) {
    const textEnd = html.indexOf('<')
    // 如果索引为0 肯定是一个标签 开头/结尾
    if (textEnd === 0) {
      // 通过这个方法获取匹配到的结果 tagName attrs
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        // 如果开始标签匹配完毕后 继续下一次匹配
        continue
      }
      // <h3/>
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    // 文本
    if (text) {
      advance(text.length)
      chars(text)
    }
  }

  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      // 标签
      advance(start[0].length)
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        // 将属性进行解析
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || att[4] || attr[5]
        })
      }
      if (end) {
        // 结束标签 >
        advance(end[0].length)
        return match
      }
    }
  }

  return root
}
