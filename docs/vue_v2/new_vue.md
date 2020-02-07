# new Vue的背后
上一节我们从入口开始一步步追溯到Vue的构造函数，并整理出Vue构造函数的结构，Vue构造函数的定义为：
```javascript
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```
该函数开发环境下回首先检查Vue是不是通过new调用，如果不是则给出警告；然后调用``this._init``进行初始化。以下面代码为例，来看看``this._init``到底做了什么。

```javascript
new Vue ({
    el: '#app',
    data: {
        test: 'test'
    },
    render: function (h) {
        return h('div', {}, [this.test]);
    } 
})
```
则options为：

```javascript
{
    el: '#app',
    data: {
        test: 'test'
    },
    render: function (h) {
        return h('div', {}, [this.test]);
    } 
}
```

上一节提到，``_init``为挂载在Vue.prototype上的函数，其定义为：

```javascript
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```
函数开头以变量vm保存Vue实例，然后定义_uid作为Vue实例的唯一标识，_uid在每次初始化实例时会递增；startTag和endTag用于在开发环境下，开启了performance并且浏览器支持performance.mark时，用于检测性能。
_vue属性标识对象为Vue实例。响应式原理相关的代码里有这样一段代码：
```javascript {8}
if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
```
可见被标识为``_vue=true``的对象不会被监测。接下来的代码为：

```javascript {2}
// merge options
if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
} else {
    vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
    )
}
```
在这里，我们举的例子的options并没有_isComponent这个属性，为什么这里有这个判断呢？其实，这个属性是框架内部属性，当在初始化组件实例时，其值为true。这里走的是else分支逻辑。else分支在实例上定义了$options属性用于初始化，``_init``函数有一系列init**函数都依赖于$options属性进行初始化操作。接下来的代码为：

```javascript
/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
} else {
    vm._renderProxy = vm
}
```
这段代码在实例上定义_renderProxy作为渲染代理，``core/instance/render.js``有这样一段代码：

```javascript
vnode = render.call(vm._renderProxy, vm.$createElement)
```
可见，_renderProxy会在调用render函数生成vnode时作为render函数的上下文使用。

```javascript
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

接下来``_init``函数调用一系列init函数进行初始化，同时触发了``beforeCreate``和``created``两个生命周期。
从调用顺序可以看出，``created``以后(包括created）的生命周期才可以访问props、data、provide里的属性。最后，

```javascript
if (vm.$options.el) {
    vm.$mount(vm.$options.el)
}
```
如果定义了el属性，则调用$mount进行挂载。整个函数里并没有看到在$options里添加el属性的逻辑，其实在``mergeOptions``内部会进行选项的合并，将传入的options合并到$options中，下一节，我们就来看看``mergeOptions``的内部实现。