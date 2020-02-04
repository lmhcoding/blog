# vue构造函数
## 寻找Vue构造函数
上一节提到``web-full-esm``的入口为:
``src/platforms/web/entry-runtime-with-compiler.js``。

```javascript
import Vue from './runtime/index'
import { compileToFunctions } from './compiler/index'
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
    ...
}
Vue.compile = compileToFunctions
...
export default Vue
```

该文件末尾导出Vue，但Vue的定义并不是在该文件中，而是从``./runtime/index``中导入，该文件主要做了重写原型上挂载$mount函数，添加静态方法compile.

``src/platforms/web/runtime/index.js``

```javascript
import Vue from 'core/index'

Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

Vue.prototype.__patch__ = inBrowser ? patch : noop

Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
export default Vue
```
runtime/index.js 导入了Vue，配置静态属性config，在Vue.options中添加平台相关指令和组件，在原型上添加__patch__和$mount方法。

``platformDirectives与Vue.options.directives``
```javascript
// platformDirectives
{
  model,
  show
}
// Vue.options.directives
{}
```
所以，``Vue.options.directives``:
```javascript
Vue.options.directives = {
    model,
    show
}
```

``platformComponents与Vue.options.components``
```javascript
// platformComponents
{
  Transition,
  TransitionGroup
}
// Vue.options.components 
{
    KeepAlive
}
```
所以,``Vue.options.components``:
```javascript
Vue.options.components = {
    Transition,
    TransitionGroup,
    KeepAlive
}
```

``core/index.js``
```javascript
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul igFunctionalRenderContextnore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__'

export default Vue
```
``core/index.js``从``core/instance/index.js``中导入了Vue，调用了initGlobalAPI往Vue中添加了静态方法，
添加了实例属性FunctionalRenderContext、$ssrContext、$isServer，添加了静态属性version，然后重新导出了Vue

``initGlobalAPI``
```javascript
export function initGlobalAPI (Vue: GlobalAPI) {
  ...
  Object.defineProperty(Vue, 'config', configDef)
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
```
initGlobalAPI添加了静态方法Vue.nextTick、Vue.use、Vue.mixin、Vue.extend、Vue.directive,Vue.component,Vue.filter,Vue.set、Vue.delete、Vue.observable,静态属性Vue.util,Vue.options,拓展了Vue.options.components

``ASSET_TYPES``
```javascript
[
  'component',
  'directive',
  'filter'
]
```
则``Vue.options``:
```javascript
Vue.options = {
    components: {},
    filters: {},
    directives: {},
    _base: Vue
}
```

``buildInComponents``
```javascript
{
  KeepAlive
}
```
所以,``Vue.options.components``:
```javascript
Vue.options.components = {
    KeepAlive
}
```


``core/instance/index.js``
```javascript
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```
可见Vue构造函数的定义在``core/instance/index.js``文件中。该文件内还调用了一系列方法丰富Vue的功能。

``initMixin方法``
```javascript
function initMixin (Vue: Class<Component>) {
    Vue.prototype._init = function (options?: Object) {
        ...
    }
}
```
initMixin方法在Vue.prototype上定义了_init方法，所以构造函数内才可以通过this调用_init。

``stateMixin``
```javascript
export function stateMixin (Vue: Class<Component>) {
  const dataDef = {}
  dataDef.get = function () { return this._data }
  const propsDef = {}
  propsDef.get = function () { return this._props }
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
    propsDef.set = function () {
      warn(`$props is readonly.`, this)
    }
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    ...
  }
}
```
stateMixin方法定义了实例属性$data、$props，实例方法$set、$delete、$watch。

``eventMixin``
```javascript
export function eventsMixin (Vue: Class<Component>) {
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    ...
  }

  Vue.prototype.$once = function (event: string, fn: Function): Component {
    ...
  }

  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    ...
  }

  Vue.prototype.$emit = function (event: string): Component {
    ...
  }
}
```
eventMixin则添加了事件相关的实例方法$on、$off、$once、$emit。

``lifecycleMixin``
```javascript
export function lifecycleMixin (Vue: Class<Component>) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    
  }

  Vue.prototype.$forceUpdate = function () {
    
  }

  Vue.prototype.$destroy = function () {
    
  }
}
```
lifecycleMixin添加了生命周期相关的实例方法_update、$forceUpdate、$destroy

``renderMixin``
```javascript
export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }

  Vue.prototype._render = function (): VNode {
    
  }
}
```
renderMixin添加了实例方法$nextTick、_render。

``installRenderHelpers定义``
```javascript
export function installRenderHelpers (target: any) {
  target._o = markOnce
  target._n = toNumber
  target._s = toString
  target._l = renderList
  target._t = renderSlot
  target._q = looseEqual
  target._i = looseIndexOf
  target._m = renderStatic
  target._f = resolveFilter
  target._k = checkKeyCodes
  target._b = bindObjectProps
  target._v = createTextVNode
  target._e = createEmptyVNode
  target._u = resolveScopedSlots
  target._g = bindObjectListeners
  target._d = bindDynamicKeys
  target._p = prependModifier
}
```
该方法在原型上添加了一些运行时辅助函数。

## 总结
Vue构造函数定义：
```javascript
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
Vue.prototype.$mount = function (el, hydrating) {

}
Vue.prototype.__patch__
Vue.prototype._init = function (options) {

}

Vue.prototype.$isServer
Vue.prototype.$$ssrContext

/* eventMixin */
Vue.prototype.$on
Vue.prototype.$once
Vue.prototype.$off
Vue.prototype.$emit

/* stateMixin */
Vue.prototype.$data
Vue.prototype.$props
Vue.prototype.$set
Vue.prototype.$delete
Vue.prototype.$watch

/* lifecycleMixin */
Vue.prototype._update
Vue.prototype.$forceUpdate
Vue.prototype.$destroy

/* renderMixin */
Vue.prototype.nextTick
Vue.prototype._render
Vue.prototype._o = markOnce
Vue.prototype._n = toNumber
Vue.prototype._s = toString
Vue.prototype._l = renderList
Vue.prototype._t = renderSlot
Vue.prototype._q = looseEqual
Vue.prototype._i = looseIndexOf
Vue.prototype._m = renderStatic
Vue.prototype._f = resolveFilter
Vue.prototype._k = checkKeyCodes
Vue.prototype._b = bindObjectProps
Vue.prototype._v = createTextVNode
Vue.prototype._e = createEmptyVNode
Vue.prototype._u = resolveScopedSlots
Vue.prototype._g = bindObjectListeners
Vue.prototype._d = bindDynamicKeys
Vue.prototype._p = prependModifier

Vue.compile = compileToFunctions
Vue.config
Vue.options = {
    directives: {
        model,
        show
    },
    components: {
        transition,
        transitionGroup,
        KeepAlive
    },
    filters: {

    },
    _base: Vue
}
Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
}
Vue.set
Vue.delete
Vue.nextTick
Vue.observable
Vue.use
Vue.extend
Vue.mixin
Vue.component
Vue.directive
Vue.filter
```
Vue实例还有更多属性，在后续深入相关原理时再进行补充。




