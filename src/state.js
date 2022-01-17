import { observe } from './observer/index'

export function initState(vm) {
  const opts = vm.$options
  // Vue 的数据来源 props methods data computed watch
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}

function initProps() {}
function initMethods() {}
function initData(vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data
  /*
    观察数据
    通过递归遍历对 data 中的数据进行观测
    也就是通过 Object.defineProperty 添加 getter/setter 
  */

  for (const key in data) {
    proxy(vm, '_data', key)
  }

  observe(data)
}
function initComputed() {}
function initWatch() {}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })
}
