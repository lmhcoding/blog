# 渲染代理

日常开发中，相信大家对下面图中的这个错误并不陌生：

![](/proxy_error.jpg)

那么，Vue是怎么在渲染的过程中触发这样的警告呢？

当Vue在挂载组件时，会执行``mountComponent``方法，该方法内部会执行如下代码，进行组件的挂载：

```javascript
updateComponent = () => {
    vm._update(vm._render(), hydrating)
}
```
``_update``内部会执行补丁算法将``_render``生成的``vdom``转换为真实dom。

``_render``内部最终会调用``$options.render``方法生成``vdom``。我们来看看它是怎么调用的：

```javascript
let vnode
try {
    // There's no need to maintain a stack becaues all render fns are called
    // separately from one another. Nested component's render fns are called
    // when parent component is patched.
    currentRenderingInstance = vm
    vnode = render.call(vm._renderProxy, vm.$createElement)
} catch (e) { ... }
```

``_render``在执行``$options.render``时会把``vm._renderProxy``作为它的上下文，``$options.render``内部访问this时，实际上访问的是``vm._renderProxy``。Vue正是通过``_renderProxy``在实例上做了一层拦截发出警告的，那么，``_renderProxy``究竟是是如何做拦截的呢？

Vue初始化时，在执行完选项合并后会执行下面的代码：

```javascript
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      // 开发环境下设置渲染代理_renderProxy
      // 用于拦截对实例属性的访问
      // 检查渲染时使用的变量、函数是否是允许的全局属性/函数
      // 检查渲染时是否的变量是否以$、_开头，并给出警告
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
```

在非生产环境下，会执行``initProxy(vm)``往Vue实例上添加``_renderProxy``属性，生产环境下，``_renderProxy``即为Vue实例。下面来看看``initProxy``的实现。

``core/instance/proxy.js``

```javascript
initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      const options = vm.$options
      // vue-loader把模板编译成render函数，render函数符合严格模式，不会使用with，并且_withStripped为true
      // 自写render函数，并将render._withStripped设置为true时使用getHandler
      // 使用template选项编译成的render函数使用with，handlers为hasHandler
      const handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler
      vm._renderProxy = new Proxy(vm, handlers)
    } else {
      vm._renderProxy = vm
    }
}
```

这段逻辑同样只有在非生产环境下才会执行，也就是说在生产环境下``initProxy``才会有定义，这也是在执行``initProxy``时要判断环境的原因。``initProxy``内部首先判断是否支持``proxy``API，若支持，则会在实例上添加一层代理拦截，并赋值给实例属性``_renderProxy``,否则，``_renderProxy``则为实例本身。

当在非生产环境时，传入Proxy构造函数的handlers可能为getHandler或hasHandler。我们先来看看这两个handler的内容：

``hasHandler``

```javascript
const hasHandler = {
    has (target, key) {
      const has = key in target
      const isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))
      if (!has && !isAllowed) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
}
```
``hasHandler``拦截的是in操作符。根据MDN的描述：

![](/proxy_has.jpg)
has可以进行四种拦截：

    - in 查询
    - 继承属性查询
    - with检查
    - Reflect.has

其中，has拦截可以进行with检查是重点，这个我们稍后会说到。

has拦截内调用了三个函数，``allowedGlobals``、 ``warnReservedPrefix``和``warnNonPresent``,我们先来看看这三个函数都做了什么。

``allowedGlobals``
```javascript
const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
)`
```
``allowedGlobals``定义了可以模板里可以使用的全局对象、全局函数等。

```javascript
// 对模板中使用了未定义的属性、函数做出警告
const warnNonPresent = (target, key) => {
warn(
    `Property or method "${key}" is not defined on the instance but ` +
    'referenced during render. Make sure that this property is reactive, ' +
    'either in the data option, or for class-based components, by ' +
    'initializing the property. ' +
    'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
    target
)
```

``warnNonPresent``则是对在模板中使用了未定义的属性、函数做出警告。

``warnReservedPrefix``

```javascript
// key 以 $、_开头不会被proxy在Vue实例中
// data中的key已$、_作出警告时给出警告
const warnReservedPrefix = (target, key) => {
    warn(
        `Property "${key}" must be accessed with "$data.${key}" because ` +
        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
        'prevent conflicts with Vue internals' +
        'See: https://vuejs.org/v2/api/#data',
        target
    )
}
```

由于data中以``$``或者``_``开头的属性并不会被代理到Vue实例上，所以在模板中访问这类属性时会调用``warnReservedPrefix``函数做出警告。

``hasHandler``会进行两种检查：

    - has: 检查访问的属性是否在实例或者实例的原型链上(in 操作符)
    - 判断是否是允许的全局访问的函数或对象，或者不在$data上的以 _ 开头的属性

当这两种判断都不满足时：

    - 如果属性在$data上，则执行 warnReservedPrefix 进行警告
    - 否则说明属性为定义，执行 warnNonPresent

``getHandler``

```javascript
const getHandler = {
    get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return target[key]
    }
}
```

``getHandler``拦截的是对象的属性读取操作，它可以拦截目标对象的一下操作：

    1. 属性访问：foo.bar
    2. 访问原型链上的属性
    3. Reflect.get

由于拦截的是对象的属性读取操作，所以，不需要进行``hasHandler``的``isAllowed``检查，只需要检查访问的属性是不是在Vue实例上，当访问的属性不在Vue实例上时,会执行``hasHandler``if判断内同样的逻辑。

为甚么会有两种拦截呢？

回到``initProxy``中，有这么一个判断：

```javascript
const handlers = options.render && options.render._withStripped
    ? getHandler
    : hasHandler
```

当render函数的``_withStripped``属性为真时为``getHandler``，否则为``hasHandler``

那么什么时候render函数的``_withStripped``属性为真呢？

其实，整个Vue源码，只有在一个地方能看到这个属性为真，那就是在``render-proxy.spec.js``测试文件中。

```javascript
it('should warn missing property in render fns without `with`', () => {
    const render = function (h) {
    return h('div', [this.a])
    }
    render._withStripped = true
    new Vue({
    render
    }).$mount()
    expect(`Property or method "a" is not defined`).toHaveBeenWarned()
})
```

从测试代码可以看出，``_withStripped``属性是为了区分render函数是否有``with``。那么什么时候render函数内会有with语句呢。

我们知道，Vue有多个编译版本，带编译器的和只有运行时的，使用带编译器的版本时，Vue会把template字符串编译为render函数，使用只有运行时的版本配合Vue-loader也可以编译得到render函数，但这两种方式得到的渲染函数是不一样的。

```javascript
new Vue({
    el: '#app'
    template: '<h1>{{a}}</h1>',
    data: {
        a: 1
    }
})
```

编译得到的render函数为：

```javascript
with(this) {
    return _c('h1', [_v(_s(a))])
}
```

而由于编译结果带有with语句，所以使用的是``has``拦截。

而使用Vue-loader时，编译出来的render函数是符合严格模式的不带with语句的：

```html
<template>
    <h1>{{a}}</h1>
</template>
```

```javascript
export default {
    data () {
        return {
            a： 1
        }
    }
}
```

编译得到的render函数为：

![](/render.jpg)
可以看到模板内的变量都是通过属性访问操作得到的，同时，编译后的render函数，Vue-loader会为其设置``_withStripped``为true，此时使用的是get拦截。

当我们手写render函数而没有设置``_withStripped``为true时，虽然传入Proxy的是``hasHandler``，但是，render函数内使用的是直接的属性访问，所以触发不了has拦截，此时，如果我们使用了未经定义的属性是得不到任何警告的。

``core/instance/proxy.js``内还对Vue.config.keyCodes进行了代理拦截：

```javascript
if (hasProxy) {
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    config.keyCodes = new Proxy(config.keyCodes, {
      set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
}
```

这段代码很简单，就是在我们尝试覆盖内置的修饰符时做出警告，防止开发者自定义键位别名时覆盖了内置的事件修饰符。








