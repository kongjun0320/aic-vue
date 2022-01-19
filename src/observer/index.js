import { def, isObject } from '../utils/index'
import arrayMethods from './array'

export function observe(data) {
  if (!isObject(data)) {
    return
  }

  return new Observer(data)
}

class Observer {
  /*
    首先需要明白一点： 数组是可以被 Object.defineProperty 劫持的 但是会存在性能问题
    1、Object.defineProperty 会对数组的索引进行拦截
    2、不会对数组的方法进行拦截
    3、开发者更多的时候是使用数组的方法操作数组 而不是使用索引
  */
  constructor(value) {
    // 为每个响应式数据添加一个 __ob__ 属性，标识已经被响应式处理过了
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observerArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
  }
  observerArray(data) {
    data.forEach((item) => observe(item))
  }
}

function defineReactive(data, key, value) {
  // 深度观测
  observe(value)

  Object.defineProperty(data, key, {
    get() {
      // console.log('收集依赖: ', key)
      return value
    },
    set(newVal) {
      if (newVal === value) {
        return
      }
      // console.log('触发更新: ', key)
      // 新设置的值 也需要观测
      observe(newVal)
      value = newVal
    }
  })
}
