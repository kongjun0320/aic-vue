import { compileToFunction } from './compiler/index.js'
import { initState } from './state'

export function initMixin(Vue) {
  /*
    初始化的工作
    1、数据的响应式
  */
  Vue.prototype._init = function (options) {
    const vm = this

    vm.$options = options
    // 初始化 state
    initState(vm)

    // 挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)

    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }

      const render = compileToFunction(template)
      options.render = render
    }
  }
}
