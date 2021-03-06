import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
/*
  Vue 的构造函数
  在使用 Vue 的过程中，我们使用 new Vue() 方式去创建 Vue 根实例
*/
function Vue(options) {
  this._init(options)
}
/*
  通过 mixin 的方式去混入方法
*/
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)

export default Vue
