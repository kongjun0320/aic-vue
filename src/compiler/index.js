/*
  ast 语法树 是用对象来描述原生语法的
  虚拟 DOM 用对象来描述 dom 节点
*/
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

export function compileToFunction(template) {
  console.log(template)
  return function render() {}
}
