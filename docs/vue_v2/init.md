# Vue初始化

前面我们讲到了，Vue在执行``_init``会使用一系列合并策略进行选项合并，最终将合并结果赋值给一个叫做``$options``的属性，这个属性是后续一系列初始化操作的基础，后续的初始化如``initLifecycle``、``initEvents``内部都使用到了这个属性，本节，我们就来聊聊在选项合并之后Vue的初始化。

## initLifecycle

``core/instance/lifecycle.js``

```javascript
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    // 循环，寻找第一个不是抽象组件的父实例
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    // 将当前组件实例添加到父实例的子组件实例数组中， 建立父子关系
    parent.$children.push(vm)
  }

  vm.$parent = parent // 保存父组件实例到$parent

  // 根实例$root为根实例
  // 根实例子组件的$parent保存着根实例的引用，它的$root为根实例的$root，即根实例
  // 往后的子组件都能通过$parent访问到父组件，而$parent.$root保存着根实例的引用
  // 所以子组件可以通过$root访问到根实例
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```

该函数首先定义常量options指向vm.$options,然后通过下面这段代码建立父子关系：

```javascript
// locate first non-abstract parent
let parent = options.parent
if (parent && !options.abstract) {
// 循环，寻找第一个不是抽象组件的父实例
while (parent.$options.abstract && parent.$parent) {
    parent = parent.$parent
}
// 将当前组件实例添加到父实例的子组件实例数组中， 建立父子关系
parent.$children.push(vm)
}

vm.$parent = parent // 保存父组件实例到$parent

// 根实例$root为根实例
// 根实例子组件的$parent保存着根实例的引用，它的$root为根实例的$root，即根实例
// 往后的子组件都能通过$parent访问到父组件，而$parent.$root保存着根实例的引用
// 所以子组件可以通过$root访问到根实例
vm.$root = parent ? parent.$root : vm
```

上面代码的作用是把当前实例添加到父实例的$children数组中，设置$parent属性指向父实例，$root属性指向根实例。注意到下面这段代码：

```javascript
let parent = options.parent
if (parent && !options.abstract) {
    // 循环，寻找第一个不是抽象组件的父实例
    while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent
    }
    // 将当前组件实例添加到父实例的子组件实例数组中， 建立父子关系
    parent.$children.push(vm)
}
```
这段代码的作用是在当前组件不是抽象组件，且parent存在时，找到第一个非抽象组件的父实例，并将当前实例添加到找到的父实例的$children数组中。由于，当当前组件为抽象组件时不会进入if分支，所以抽象组件不会被添加到父组件的$children数组中，由此可见，抽象组件不会出现在父子关系链中。从这段代码的第一行可以知道``parent=options.parent``，即``$options.parent``，那么``$options.parent``又是来源哪里呢？

我们知道，Vue给我们提供了一个parent选项，使我们可以手动指定父实例，当我们没有配置parent选项时，$options.parent又来源于哪里呢？

其实，Vue在组件化的时候会执行下面这段代码：

``core/vdom/create-component.js``

```javascript
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
```
这个函数的第二个形参就是父组件实例，Vue在创建子组件时会先通过Vue.extend创建子组件构造器，在通过该构造器实例化子组件实例，上面这个函数最后一行的``vnode.componentOptions.Ctor``就是子组件构造器，我们注意到，传入``vnode.componentOptions.ctor``的options._isComponent为true，所以在执行初始化时，会进入下面这个逻辑：

``core/instance/init.js``

```javascript
if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      // 组件化时调用
      initInternalComponent(vm, options)
}
```

``initInternalComponent``定义如下：

```javascript {5}
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode // 占位vnode
  opts.parent = options.parent // 父组件实例
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData // 父组件传入的props
  opts._parentListeners = vnodeComponentOptions.listeners 
  opts._renderChildren = vnodeComponentOptions.children // 组件slot
  opts._componentTag = vnodeComponentOptions.tag // 组件tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```

上面函数的第五行代码就将父组件实例赋值给了$options.parent。讲到这里，我们知道了$options.parent是在什么情况下被赋值的，那么这个parent究竟是什么呢?

我们知道，这个parent是函数``createComponentInstanceForVnode``的形参，找到调用这个函数的地方：

```javascript
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
  ...
}
```

传入``createComponentInstanceForVnode``的第二个实参``activeInstance``就是parent。根据``core/vdom/create-component.js``的import语句可知，``activeInstance``来源于文件``core/instance/lifecycle.js``。

```javascript
export let activeInstance: any = null
export let isUpdatingChildComponent: boolean = false

export function setActiveInstance(vm: Component) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = prevActiveInstance
  }
}
```

当Vue调用``Vue.prototype._update``将vnode挂载为真实dom时，会调用``setActiveInstance``将当前挂载的实例传入，所以``activeInstance``为当前正在挂载的实例，当在生成子组件实例时，activeInstance为父实例。Vue正是通过``activeInstance``这个变量做到自动侦测父级的。

做完父子关系的建立之后，是``$root``属性的初始化：

```javascript
vm.$root = parent ? parent.$root : vm
```

有父级就用父级的$root，否则为自身。

![](/$root.jpg)

$root属性初始化之后，``initLifecycle``还往实例上添加了一些属性，即下面的代码：

```javascript
vm.$children = []
vm.$refs = {}

vm._watcher = null
vm._inactive = null
vm._directInactive = false
vm._isMounted = false
vm._isDestroyed = false
vm._isBeingDestroyed = false
```
这些属性都与生命周期相关，这里先不分析它们的用途，在后面讲到相关内容时再分析。

## initEvents

执行完``initLifecycle``之后，接下来是``initEvents``，该函数的源码如下：

``core/instance/events.js``

```javascript
export function initEvents (vm: Component) {
  vm._events = Object.create(null) // 存储事件
  vm._hasHookEvent = false // 监听hook事件时为true：$on('hook:beforeDestroy')
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) { // 初始化父组件绑定的事件
    updateComponentListeners(vm, listeners)
  }
}
```
这个函数比较简单，初始化``_events``用于后续存储用户绑定的事件，``_hasHookEvent``用于标志用户是否监听生命周期钩子事件,如：

```html
<template>
  <comp @hook:mounted="onMounted"/>
</template>
```

```javascript
export default {
  created () {
    this.$once('hook:beforeDestroy', function () {
      // some code
    })
  }
}
```

然后就是在父组件有绑定事件到子组件时，初始化父组件绑定的事件。

## initRender

紧接着，Vue会执行``initRender``，该函数的源码如下：

``core/instance/render.js``

```javascript
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  // template编译得来的render函数内部使用的是_c
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  // 用户手写render函数时调用的是$createElement
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    // isUpdatingChildComponent只有在更新子组件时才为true
    // $attrs、$listeners为只读属性，组件自身不能修改，只能在组件更新时，由父组件传入更新
    // 将$attrs和$listeners设置为响应式的
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}
```
函数开始往Vue实例上挂载两个属性``_vnode``和``_staticTrees``，且初始值为null，这两个属性会在合适的时机被赋值（具体什么时候有什么作用后续我们讲到相关源码的时候再说），4到8行代码初始化与slot相关的属性：

```javascript
vm.$vnode
vm.$slots
vm.$scopedSlots
```

这三属性的具体作用等我们讲到插槽的实现原理时再详细说明，再往下是这段代码：

```javascript
// bind the createElement fn to this instance
// so that we get proper render context inside it.
// args order: tag, data, children, normalizationType, alwaysNormalize
// internal version is used by render functions compiled from templates
// template编译得来的render函数内部使用的是_c
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
// normalization is always applied for the public version, used in
// user-written render functions.
// 用户手写render函数时调用的是$createElement
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```
这段代码说白了就是对``createElement``函数的包装，相信手写过render函数的同学都对``vm.$createElement``非常熟悉，比如：

```javascript
export default {
  render (h) {
    return h('div', {}, 'hahahah')
  }
}
```
这里的h其实就是``vm.$createElement``,即然``$createElement``是实例上的一个方法，那么，其实我们还可以这样写：

```javascript
export default {
  render () {
    return this.$createElement('div', {}, 'hahahah')
  }
}
```

最后，``initRender``会执行下面这段代码：

```javascript
// $attrs & $listeners are exposed for easier HOC creation.
// they need to be reactive so that HOCs using them are always updated
const parentData = parentVnode && parentVnode.data

/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
  // isUpdatingChildComponent只有在更新子组件时才为true
  // $attrs、$listeners为只读属性，组件自身不能修改，只能在组件更新时，由父组件传入更新
  // 将$attrs和$listeners设置为响应式的
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
    !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
  }, true)
  defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
    !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
  }, true)
} else {
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
  defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
}
```

这段代码的作用是调用``defineReactive``在实例上定义两个响应式属性``$attrs``和``$listeners``,同时在非生产环境下并且不是在更新组件时，对这两个属性的修改做出警告。``defineReactive``的实现等我们讲响应式原理的时候再谈，这里先来谈谈Vue是怎么判断当前是不是在更新子组件的。

注意到，上面调用``defineReactive``的第4个参数``customSetter``函数内使用了这么个变量——``isUpdatingChildComponent``,这个变量的定义在：

``core/instance/lifecycle.js``

```javascript
export let isUpdatingChildComponent = false;
```

它的初始值为``false``，当Vue更新组件时，Vue会调用``updateChildComponent``方法。

``core/instance/lifecycle.js``

```javascript
export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true
  }
  // other code
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false
  }
}
```

该函数在非生产环境下会将``isUpdatingChildComponent``设置为true，此时，``updateChildComponent``可以更新实例的``$attrs``和``$listeners``,函数最后又将该变量还原为false，所以当我们手动设置``$attrs``和``$listeners``时，会被这两个属性的setter拦截，此时，由于``updateChildComponent``未被调用，``isUpdatingChildComponent``仍然为false，所以最终会触发警告。

## 生命周期

紧接着，Vue会触发生命周期钩子——``beforeCreate``

```javascript
callHook(vm, 'beforeCreate')
```

现在，就让我们进入``callHook``函数的内部来看看生命周期钩子是如何触发的。

``core/instance/lifecycle.js``

```javascript
export function callHook (vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```
在讲选项合并策略时我们说过，所有的生命周期钩子的合并结果最终都是一个数组，所以``callHook``函数执行生命周期钩子是从合并结果``$options``里取出钩子的``handlers``（如果用户有定义钩子处理函数的话)，然后对其进行遍历执行。紧接着是下面这段代码：

```javascript
if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
}
```

当``vm._hasHookEvent``为真时，Vue会触发hook事件（如：hook:mounted)。我们知道，``vm._hasHookEvent``是在``initEvents``是定义的，其初始值为false，那么什么时候它为true呢？答案就在我们用来绑定事件的函数``$on``中。

``core/instance/events.js``

```javascript {12}
const hookRE = /^hook:/
Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
  const vm: Component = this
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      vm.$on(event[i], fn)
    }
  } else {
    (vm._events[event] || (vm._events[event] = [])).push(fn)
    // optimize hook:event cost by using a boolean flag marked at registration
    // instead of a hash lookup
    if (hookRE.test(event)) {
      vm._hasHookEvent = true
    }
  }
  return vm
}
```

当我们侦听的事件满足``hookRE``即以``hook:``开头时，``vm._hasHookEvent``为true。

回到``callHook``函数，我们发现，前面我们讲的``callHook``的逻辑被包裹在两个函数的执行内：

```javascript
pushTarget()
popTarget()
```

为什么要这样做呢？从注释可以看出，这是为了禁止在执行生命周期钩子时进行依赖收集，那么，又是为什么要做这样一个禁止收集的操作呢？这是因为我们可能会在钩子内使用父组件传入的props执行一些操作，此时就可能导致多余的依赖收集，从而使父组件update两次，详细可见[issue #7573](https://github.com/vuejs/vue/issues/7573)

## initInjections、initState、initProvide

``_init``函数剩余跟初始化相关的代码如下：

```javascript
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

``initInjections``负责``inject``选项的初始化，``initState``负责``props``、``methods``、``data``、``computed``和``watch``选项的初始化，``initProvide``负责``provide``选项的初始化，由于这三部分内容都与响应式系统有关，所以等到我们揭开Vue响应式的面纱后再回过来说明。从调用顺序可以知道，在``created``之前的钩子是访问不了响应式数据和``methods``的。







