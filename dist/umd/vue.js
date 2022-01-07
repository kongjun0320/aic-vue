(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function isObject(value) {
    return _typeof(value) === 'object' && value !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  /*
    数组响应式采用 iop 思想去拦截数组的方法
    覆盖会修改原数组的方法
  */
  // 待覆盖的方法
  var methods = ['push', 'shift', 'unshift', 'pop', 'splice', 'reverse', 'sort']; // 数组原型方法

  var arrayPrototype = Array.prototype;
  /**
   使用 Object.create 创建一个原型指向数组原型的对象
   用此方法去覆盖需要响应式处理的数组原型( data.__proto__ = arrayMethods)
   */

  var arrayMethods = Object.create(arrayPrototype);
  /*
    为 arrayMethods 添加需要重写的数组方法，当数组调用 methods 会调用 arrayMethods 方法
    如果是调用非 methods 方法，则还是调用 arrayMethods 原型中的方法（也就是数组原型的方法）
  */

  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log('数组收集', this);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = arrayPrototype[method].apply(this, args);
      var ob = this.__ob__;
      /*
        当调用数组 push/unshift/splice 等方法时，会新增数组元素，针对新增的用户元素
        也需要做响应式处理
      */

      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(3);
          break;
      }

      if (inserted) {
        ob.observerArray(inserted);
      }

      return result;
    };
  });

  function observe(data) {
    if (!isObject(data)) {
      return;
    }

    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    /*
      首先需要明白一点： 数组是可以被 Object.defineProperty 劫持的 但是会存在性能问题
      1、Object.defineProperty 会对数组的索引进行拦截
      2、不会对数组的方法进行拦截
      3、开发者更多的时候是使用数组的方法操作数组 而不是使用索引
    */
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 为每个响应式数据添加一个 __ob__ 属性，标识已经被响应式处理过了
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;
        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // 深度观测
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        console.log('收集依赖: ', key);
        return value;
      },
      set: function set(newVal) {
        if (newVal === value) {
          return;
        }

        console.log('触发更新: ', key); // 新设置的值 也需要观测

        observe(newVal);
        value = newVal;
      }
    });
  }

  function initState(vm) {
    var opts = vm.$options; // Vue 的数据来源 props methods data computed watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data;
    /*
      观察数据
      通过递归遍历对 data 中的数据进行观测
      也就是通过 Object.defineProperty 添加 getter/setter 
    */

    observe(data);
  }

  function initMixin(Vue) {
    /*
      初始化的工作
      1、数据的响应式
    */
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 初始化 state

      initState(vm);
    };
  }

  /*
    Vue 的构造函数
    在使用 Vue 的过程中，我们使用 new Vue() 方式去创建 Vue 根实例
  */

  function Vue(options) {
    this._init(options);
  }
  /*
    通过 mixin 的方式去混入方法
  */


  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
