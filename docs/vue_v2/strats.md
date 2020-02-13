# 选项合并策略
上节提到，在进行选项合并的时候，是通过options的key取到预定义的合并策略进行对应选项合并，这节我们就来说说这些预定义的策略是怎么工作的。先来看下面这段代码：

```javascript {2}
function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
}
````

这是进行合并时调用的函数，从函数第2行可以知道，当options的key在策略对象``strats``中找不到对应的策略``strat``时，会使用默认的策略``defaultStrat``。

## 默认策略

``defaultStrat``的定义在``core/util/options.js``中。

```javascript
/**
 * Default strategy.
 * 默认合并策略，child不为undefined取child
 * 否则，取parent
 */
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}
```

默认合并策略并没有做合并的操作，只是简单的判断childVal是否是``undefined``，是则返回``parentVal``,否则返回``childVal``。

## el和propsData的合并策略

```javascript
/**
 * Options with restrictions
 * el、propsData合并策略采取默认合并策略
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    return defaultStrat(parent, child)
  }
}
```
可以看到，非生产环境下，会往策略对象``strats``中添加两个策略(``el``和``propsData``)，这两个策略都是默认策略——``defaultStrat``。注意到这里有个判断:

```javascript
if (!vm) {
    warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
    )
}
```

如果vm不存在，则会发出警告——选项el/propsData只能在实例化实例时(即使用new时)才能用。为什么通过这个判断就能知道是不是在创建实例呢？

策略函数的vm是从``mergeOptions``透传而来，mergeOptions的第三个参数是可选参数vm(即Vue实例)，那什么时候vm参数没传呢？

其实，在使用``Vue.extend``和``Vue.mixin``时，也会调用``mergeOptions``。

```javascript
// Vue.extend 代码片段
Sub.options = mergeOptions(
    Super.options,
    extendOptions
)
Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
}
```
可以看到这两种情况没有传vm参数。而在实例化实例时，是这样调用的：

```javascript
// 选项合并
vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
)
```
此时，有传vm参数。所以可以通过vm是否存在判断是否在实例化实例或者创建子组件构造器(vm不存在)。

## 生命周期合并策略

先来看下面这段代码：

```javascript
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

// shared/constants.js
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
]
```

可见所有的生命周期钩子的合并都使用的``mergeHook``策略函数。

``mergeHook``的定义同样在``core/util/options.js``文件中(其他选项的合并策略也定义在这个文件中)。

```javascript
/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  const res = childVal
    ? parentVal // 存在parentVal，则parentVal必定是个数组
      ? parentVal.concat(childVal) // parentVal 和 childVal都存在，合并到parentVal中
      : Array.isArray(childVal) 
        ? childVal //只存在childVal且是数组，直接返回
        : [childVal] 
    : parentVal // 不存在childVal，返回parentVal
  return res
    ? dedupeHooks(res)
    : res
}
```

对于生命周期钩子的合并使用的是多元三重运算符，主要逻辑如下：

    1. 若childVal不存在，直接返回parentVal赋值给res
    2. childVal存在，判断parentVal是否存在
    3. 若parentVal存在，将childVal合并到parentVal中，并赋值给res
    4. 否则，判断childVal是否是数组，是数组直接返回childVal赋值给res，否则转为数组再赋值给res
    5. 若res存在，则对其进行去重，否则直接返回

从第6、11行代码可以知道，我们定义生命周期钩子可以使用数组元素为函数的数组。即，我们可以像下面的代码一样定义生命周期钩子：

```javascript
{
    created: [
        function () {console.log(1)},
        function () {console.log(2)}
    ]
}
```

从函数第5、10行可以知道，parentVal要么不存在，要么一定是个数组，为什么可以确定parentVal存在时一定是数组呢？

当我们直接使用``new Vue``创建实例时，此时传给``mergeOptions``的parent参数为``Vue.options``，从Vue构造函数一节我们知道，Vue.options为:

```javascript
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
```

其中并没有定义生命周期钩子，所以此时parentVal为undefined。但是，当我们用``extends``、``mixins``配置项或者``Vue.extend``、``Vue.mixin``钩子时，此时传给``mergeHook``的parentVal必定是数组。以Vue.mixin为例：

```javascript
Vue.mixin({
    created () {
        console.log('created')
    }
})
```
上面的代码最终调用如下代码：

```javascript
this.options = mergeOptions(this.options, {
    created () {
        console.log('created')
    }
})
```
这里的this即是Vue，所以当mergeOptions内调用mergeHook时，传给mergeHook的parentVal为undefined，而childVal为上面的created函数。根据上面对mergeHook的分析，最终Vue.options中created钩子为：

```javascript
[
    function () {
        console.log('created')
    }
]
```
此时，当我们再用``Vue.extend``去创建子构造器时，最终传给``mergeHook``的parentVal就是上面代码中的数组。其他情况类似。

## Assets（components、filters、directives）合并策略

```javascript
ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})
// shared/constants.js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

可见，components、filters、directives的合并策略函数都是``mergeAssets``，定义如下：

```javascript
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 * 
 * components、directives、filters合并
 */
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  // {__proto__: parentVal}
  const res = Object.create(parentVal || null) // 以parentVal为原型创建对象
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal) // 把childVal混入res
  } else {
    return res
  }
}
```

assets的合并策略比较简单，首先以``parentVal``为原型创建对象res，然后如果``childVal``存在的话，就将``childVal``混入res中，否则直接返回res。当传给mergeOptions的parent和child如下时：

```javascript
parent = Vue.options = {
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

child = {
  components: {
    Test
  }
}
```

当进行components合并时，parentVal和childVal分别为：

```javascript
// parentVal
{
  Transition,
  TransitionGroup,
  KeepAlive
}
// childVal
{
  Test
}
```

则合并的结果为:

```javascript
{
  components: {
    __proto__: {
      Transition,
      TransitionGroup,
      KeepAlive
    },
    Test
  }
}
```

内置组件在最终合并结果的components的原型链上，这就是我们可以直接使用这些内置组件而不用再组件内注册的原因。directives和filters的合并过程类似。

## watch 合并策略

```javascript
/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 * 
 * 侦听器最终会合并成数组的形式
 * {
 *   key: [watcher1, watcher2] // parentVal和childVal存在相同的key
 *   key: watcher // 只有一个存在
 * }
 */
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) parentVal = undefined
  if (childVal === nativeWatch) childVal = undefined
  /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null)
  if (process.env.NODE_ENV !== 'production') { // watch选项必须是个普通对象
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = {} // 最终合并结果
  extend(ret, parentVal) // 将parentVal混入到ret
  for (const key in childVal) { // 遍历childVal中的watcher
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent] // parentVal中定义了key相同的watcher，且不为数组，则将该watcher存放在数组中
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret
}
```

watcher的合并过程为：

    1. 如果childVal不存在，返回以parentVal为原型的对象或者一个空对象
    2. 如果parentVal不存在，返回childVal
    3. 如果parentVal和childVal都存在：
      1. 定义ret变量保存最终结果
      2. 将parentVal混入ret
      3. 遍历childVal，获取parent和child
      4. 如果存在parent，确保parent是数组
      5. parent存在，将child合并到parent中，否则，返回child数组。

举例如下：

```javascript
const Child = Vue.extend({
  watch: {
    a (v) {
      console.log(`hello ${v}`})
    }
  }
})
new Child({
  watch: {
    a (newVal) {
      console.log(newVal)
    }
  }
})
```
执行Vue.extend时传给``strat.watch``的parentVal和childVal分别为：

```javascript
// parentVal 为Vue.options.watch.a
undefined
// childVal
function a (v) {
  console.log(`hello ${v}`})
}
//
```

合并结果为:

```javascript
Child.options.watch = {
  a (v) {
    console.log(`hello ${v}`)
  }
}
```

执行``new Child``时传给``strat.watch``的parentVal和childVal为：

```javascript
// parentVal
{
  a (v) {
    console.log(`hello ${v}`)
  }
}
// childVal
{
  a (newVal) {
    console.log(newVal)
  }
}
```
最终合并结果为: 

```javascript
vm.$options.watch = {
  a: [
    a (v) {
      console.log(`hello ${v}`)
    },
    a (newVal) {
      console.log(newVal)
    }
  ]
}
```

## props、inject、methods、computed合并策略

```javascript
/**
 * Other object hashes.
 * props、methods、inject、computed的合并策略
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}
```

props、methods、inject、computed的合并过程为：

    1. 非生产环境下检查传入的childVal是不是普通对象，如果不是，给出警告
    2. 如果不存在parentVal，直接返回childVal
    3. 存在parentVal, 创建一个空对象ret
    4. 将parentVal混入ret
    5. 若存在childVal， 将childVal混入ret并返回；否则直接返回ret

合并逻辑较为简单，这里就不举例了。这里为什么不用检查parentVal是否为普通对象呢？这是因为parentVal一旦存在，必定是由上面的合并策略合并而来，而该策略的最终结果必定是个普通对象。

## data 合并策略

```javascript
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}
```

忽略第7到16行代码，data合并策略实际就是调用``mergeDataOrFn``。7到16行实际就是在我们定义组件的时候如果data选项不是函数给出警告。为什么vm不存在时可以确定是组件定义？这在el合并策略时已经解释过。

```javascript
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) { // Vue.extends内调用mergeOptions，vm为undefined
    // in a Vue.extend merge, both should be functions
    // parentVal和childVal必定存在一个，且都为函数
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else { // 直接调用new Vue时
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}
```

mergeDataOrFn 的作用是返回一个可以获得最终合并后的data的函数，其主要逻辑可以分为两种情况：

- vm不存在，即创建子组件构造器(Vue.extend)和全局mixin（Vue.mixin)时
    
    1. childVal不存在，返回parentVal，比如：
    ```javascripto
    const Parent = Vue.extend({
      data () {
        return {a: 1}
      }
    })
    Parent.extend({})
    ```
    2. parentVal不存在，返回childVal，比如：
    ```javascript
    Vue.extend({
      data () {
        return {a:1}
      }
    })
    ```
    3. parentVal和childVal都存在，返回函数``mergeDataFn``，该函数调用``mergeData``合并data。比如：
    ```javascript
    Vue.mixin({
      data () {
        return {a:1}
      }
    })
    Vue.extend({
      data () {
        return {b: 1}
      }
    })
    ```

- 创建实例时

    1. 返回函数``mergeInstanceDataFn``

可见，data的合并并不会直接生成最终的data对象，而是返回一个用来生成最终合并后data对象的函数

我们注意到，``mergeDataFn``和``mergeInstanceDataFn``都有类似下面这段逻辑:

```javascript
typeof childVal === 'function' ? childVal.call(this, this) : childVal,
typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
```
我们知道，``childVal``要么不存在，只要存在，要么是函数，要么是普通对象。当是函数时，就通过执行该函数来获取一个普通对象。所以上面这段函数的目的是为了获取普通对象，然后传给``mergeData``来获取合并后的data。

``mergeData``的源码如下:

```javascript
/**
 * Helper that recursively merges two data objects together.
 * 递归合并data
 */
function mergeData (to: Object, from: ?Object): Object {
  if (!from) return to
  let key, toVal, fromVal

  // 获取from自身所有的key
  const keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from)

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    // in case the object is already observed...
    if (key === '__ob__') continue
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      // to中没有该属性，直接添加到to中
      set(to, key, fromVal)
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      // to不等于from，且都为普通对象，递归合并
      mergeData(toVal, fromVal)
    }
  }
  return to
}
```

由``mergeData``的调用可知，参数to即childVal产生的普通对象，from即parentVal产生的普通对象。弄清楚from和to是什么后，下面我们来分析它内部的实现逻辑。

其逻辑可简单概括为：在from不存在时返回to，from存在时，把from混入to返回。执行流程如下：

    1. 如果from不存在，返回to
    2. 遍历from
      1. 如果from的key不在to中， 调用set把from中的key添加到to中
      2. from中的key在to中，且两对象的key的值不等并且都为普通对象，递归调用``mergeData``进行深合并
      3. 其他情况不做处理，即只保留to中的值

以下面的代码为例:

```javascript
const Child = Vue.extend({
  data () {
    return {
      a: 1,
      b: {
        c: 1,
        d: 2
      },
      e: [1, 2]
    }
  }
})
new Child({
  data: {
    a: 2,
    b: {
      c: 3,
    },
    e: [1, 2, 3]
  }
})
```

对于上面这个例子，最终执行mergeData时from和to为：

```javascript
// from
{
  a: 1,
  b: {
    c: 1,
    d: 2
  },
  e: [1, 2]
}
// to
{
  a: 2,
  b: {
    c: 3,
  },
  e: [1, 2, 3]
}
```

- 对于a: to和from中都存在，但不是普通对象，采用to中的a
- 对于b: 递归调用mergeData，传入to为{c:3, d:2},from为{c: 1}
  - 对于c,直接采用to.c
  - 对于d,调用set将d添加到to
- 对于e: 采用to.e

最终to为:

```javascript
{
  a: 2,
  b: {
    c: 3,
    d: 2
  },
  e: [1, 2, 3]
}
```

由于to是个普通对象，其函数最后返回to，所以``mergeDataFn``和``mergeInstanceDataFn``最终的返回值为普通对象，所以，data选项的最终合并结果为一个函数，该函数的执行结果为数据对象。

## provide 合并策略

```javascript
strats.provide = mergeDataOrFn
```

provide选项的合并同样使用``mergeDataOrFn``。

我们知道，provide选项既可以配置为对象，也可以配置为函数，这也是有下面这段逻辑判断的原因：

```javascript
typeof childVal === 'function' ? childVal.call(this, this) : childVal,
typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
```

因为``mergeDataFn``在合并data和provide时都有用到，在合并data时，对应``if(!vm)``分支，childVal和parentVal只要存在，肯定为函数，对应else分支，childVal可为任何值，所以需要检测childVal的类型，但parentVal同样只要存在肯定为函数；

在合并provide时，由于没有下面这个判断，

```javascript
if (childVal && typeof childVal !== 'function') {
    process.env.NODE_ENV !== 'production' && warn(
      'The "data" option should be a function ' +
      'that returns a per-instance value in component ' +
      'definitions.',
      vm
    )

    return parentVal
  }
```
所以处理provide时childVal和parentVal可以为任何值，无论进入哪个分支逻辑，都需要判断它们的类型。

## 几点补充

1. 为什么把data选项的合并结果设置为函数？

将data选项合并为一个函数，可以把data的合并延迟到inject、props、methods初始化之后，这样，初始化data可以使用inject、props、methods里的数据。

2. data里访问props、inject、methods除了使用this访问外，还可以怎么做？

```javascript
typeof childVal === 'function' ? childVal.call(this, this) : childVal,
typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
```

在分析data选项的合并策略时，我们说过，parentVal和childVal用于产生``mergeData``的参数from和to，当parentVal或childVal为函数时，它的执行上下文this即为Vue实例，所以data可以通过this来访问实例上的属性，注意到，``call``的第二个参数依然是Vue实例，还可以这样做：

```javascript
{
  props: {
    a: String
  },
  data ({a}) {
    return {
      b: a + 1
    }
  }
}
```






