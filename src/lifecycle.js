import Watcher from './observer/watcher'
import { patch } from './vdom/patch'

export function mountComponent(vm, el) {
  const options = vm.$options // render
  // 真实的DOM元素
  vm.$el = el
  // 渲染页面

  // 无论是渲染还是更新都是会调用此方法
  const updateComponent = () => {
    // _render: 返回的是虚拟dom
    // _update: 返回的是真实DOM
    vm._update(vm._render())
  }
  // 渲染 watcher
  new Watcher(vm, updateComponent, () => {}, true) //true 表示他是一个渲染 watchers
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}

/*
  watcher 就是用来渲染的
  vm._render 通过解析 render 方法, 渲染出虚拟 dom
  vm._update 通过虚拟dom，创建真实的 dom
*/
