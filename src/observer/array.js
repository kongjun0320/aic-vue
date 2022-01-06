/*
  数组响应式采用 iop 思想去拦截数组的方法
  覆盖会修改原数组的方法
*/
// 待覆盖的方法
const methods = ['push', 'shift', 'unshift', 'pop', 'splice', 'reverse', 'sort']
// 数组原型方法
const arrayPrototype = Array.prototype
/**
 使用 Object.create 创建一个原型指向数组原型的对象
 用此方法去覆盖需要响应式处理的数组原型( data.__proto__ = arrayMethods)
 */
const arrayMethods = Object.create(arrayPrototype)
/*
  为 arrayMethods 添加需要重写的数组方法，当数组调用 methods 会调用 arrayMethods 方法
  如果是调用非 methods 方法，则还是调用 arrayMethods 原型中的方法（也就是数组原型的方法）
*/
methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    console.log('数组收集', this)
    const result = arrayPrototype[method].apply(this, args)
    const ob = this.__ob__
    /*
      当调用数组 push/unshift/splice 等方法时，会新增数组元素，针对新增的用户元素
      也需要做响应式处理
    */
    let inserted

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(3)
        break
      default:
        break
    }

    if (inserted) {
      ob.observerArray(inserted)
    }

    return result
  }
})

export default arrayMethods
