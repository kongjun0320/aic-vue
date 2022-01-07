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
  }
}
