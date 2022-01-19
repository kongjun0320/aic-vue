import { createELement, createTextNode } from './vdom/create-element'

export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    return createELement(...arguments)
  }
  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }
  Vue.prototype._s = function (val) {
    return val === null
      ? ''
      : typeof val === 'object'
      ? JSON.stringify('val')
      : val
  }

  Vue.prototype._render = function () {
    const vm = this

    const { render } = vm.$options

    return render.call(vm)
  }
}
