/*
  ast 语法树 是用对象来描述原生语法的
  虚拟 DOM 用对象来描述 dom 节点
*/

import { parseHTML } from './parse-html'

export function compileToFunction(template) {
  // 解析 html 字符串，将html字符串 -> ast 语法树
  const root = parseHTML(template)
  console.log(root)
  return function render() {}
}
