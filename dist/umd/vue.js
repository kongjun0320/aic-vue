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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // a-0a
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  /*
    ?: -> 匹配不捕获
    (?:${ncname}\\:)  ?    ${ncname}
    <aa:ba>
  */

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  /*
    标签开头的正则
  */

  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  /*
    结束标签
  */

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  /*
    匹配属性
  */

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  /*
    匹配标签结束
    */

  var startTagClose = /^\s*(\/?)>/;
  var root; // ast 语法树的树根

  var currentParent; // 标识当前的父亲

  var stack = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  }

  function start(tagName, attrs) {
    // console.log(`开始标签: ${tagName}, 属性是: ${JSON.stringify(attrs)}`)
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element;
    stack.push(element);
  }

  function chars(text) {
    // console.log(`文本是: ${text}`)
    text = text.replace(/\s/g, '');

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function end(tagName) {
    // console.log(`结束标签: ${tagName}`)
    var element = stack.pop();
    currentParent = stack[stack.length - 1];

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function parseHTML(html) {
    while (html) {
      var textEnd = html.indexOf('<'); // 如果索引为0 肯定是一个标签 开头/结尾

      if (textEnd === 0) {
        // 通过这个方法获取匹配到的结果 tagName attrs
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); // 如果开始标签匹配完毕后 继续下一次匹配

          continue;
        } // <h3/>


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      } // 文本


      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        }; // 标签

        advance(start[0].length);

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 将属性进行解析
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || att[4] || attr[5]
          });
        }

        if (_end) {
          // 结束标签 >
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  /*
    ast 语法树 是用对象来描述原生语法的
    虚拟 DOM 用对象来描述 dom 节点
  */

  /*
    匹配双大括号
  */
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  // attrs: [{ name: 'id', value: 'app' },{ name: 'style', value: {color: ' red'} }]

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value.trim();
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ": ").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    } else {
      // <div>a {{ name }} b {{ age }} c</div>
      var text = node.text;
      var tokens = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",\n      ").concat(el.attrs.length ? genProps(el.attrs) : undefined, "\n      ").concat(children ? ",".concat(children) : '', "\n    )\n  ");
    return code;
  }

  function compileToFunction(template) {
    // 解析 html 字符串，将html字符串 -> ast 语法树
    var root = parseHTML(template); // 需要将 ast 语法树生成最终的render函数 就是字符串拼接

    var code = generate(root); // 所有的模版引擎的实现 都需要 new Function + with

    var renderFn = new Function("with(this){ return ".concat(code, " }"));
    return renderFn;
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

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }

  function initMixin(Vue) {
    /*
      初始化的工作
      1、数据的响应式
    */
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 初始化 state

      initState(vm); // 挂载

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template);
        options.render = render;
      }
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
