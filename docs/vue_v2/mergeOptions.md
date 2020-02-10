# 选项合并（mergeOptions)
上一节提到Vue在初始化的时候会执行``mergeOptions``（选项合并)函数，并将函数返回的结果赋值给``vm.$options``。本节就来探究该函数到底做了什么？先来看``Vue.prototype._init``里是如何调用``mergeOptions``的。

```javascript
// 选项合并
vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
)
```

## 参数解读

可以看到，该函数需要三个参数，其中，vm显然是Vue实例，options是执行new Vue时传入的参数options，那么，
``resolveConstructorOptions(vm.constructor)``是什么呢？在JS中，函数也是对象，也可以有属性。顾名思义，该函数解析构造函数上的options，以上一节的例子为例，即Vue.options。

``resolveConstructorOptions``的定义为:

```javascript
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}
```

该函数第一行代码为：

```javascript
let options = Ctor.options
```

其中Ctor为vm.constructor,对应我们的例子，即为Vue，则options为Vue.options。然后是一个条件分支，判断Ctor是否有super属性，有则执行条件分支里的逻辑，否则直接返回options(Vue.options)。那么，什么时候会执行if里面的逻辑呢？

其实，除了直接调用new Vue生成实例外，我们还可以通过Vue.extends生成Vue的子类，然后调用子类构造函数生成实例。当使用Vue.extends生成子类时会在最终生成的子类构造器添加super属性，该属性持有对父类构造器的引用。当用子类构造函数生成实例时，Ctor.super为真，执行if里的逻辑。那么if分支里究竟做了什么呢？

```javascript
if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions
        // check if there are any late-modified/attached options (#4976)
        const modifiedOptions = resolveModifiedOptions(Ctor)
        // update base extend options
        if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
        if (options.name) {
        options.components[options.name] = Ctor
        }
    }
}
```

if分支第一行先递归获取父构造器的options，然后就是判断父类构造器的options是否被更改，若被更改，则更新Ctor.superOptions为最新父构造器的options，获取Ctor最新被修改的options用来更新Ctor.extendOptions,即如下几行代码：

```javascript
// check if there are any late-modified/attached options (#4976)
const modifiedOptions = resolveModifiedOptions(Ctor)
// update base extend options
if (modifiedOptions) {
    extend(Ctor.extendOptions, modifiedOptions)
}
```

为什么要有这段逻辑呢？这主要是因为使用vue-hot-reload-api/vue-loader时，会向生成的组件构造器中注入一些属性，倘若没有这段逻辑，在使用生成的构造器生成实例时，新注入的属性会被去掉。具体例子可以查看[issue #4976](https://github.com/vuejs/vue/issues/4976)。

更新完Ctor.extendOptions后则调用mergeOptions将最新的父构造器的options和Ctor.extendOptions合并后赋值给Ctor.options。最后，如果options.name判断为真，则设置options.components[options.name] = Ctor，用于组件的递归调用。

通过上面的分析，结合上一节的例子，我们可以知道，如下代码：

```javascript
vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
)
```

相当于:

```javascript
vm.$options = mergeOptions(
    Vue.options,
    {
        el: '#app',
        data: {
            test: 'test'
        },
        render: function (h) {
            return h('div', {}, [this.test]);
        }
    }
    vm
)
```

由Vue构造函数一节可知，

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

则有:

```javascript
vm.$options = mergeOptions(
    {
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
    },
    {
        el: '#app',
        data: {
            test: 'test'
        },
        render: function (h) {
            return h('div', {}, [this.test]);
        }
    },
    vm
)
```

至此，我们弄清楚了传入mergeOptions的三个参数究竟是什么，接下来就让我们来看看该函数内部的逻辑。

```javascript
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }

  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

函数内部首先检查component名称是否符合要求，接下来是选项的规范化(包括props、inject、directives)，然后是将extends、mixins合并到parent中，最后是将parent和child合并到options并返回。

## 组件名称检查
组件名称检查的函数在``core/util/options``文件中。如下：

```javascript
/**
 * Validate component names
 */
function checkComponents (options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}
```

该函数遍历options.components中定义的component，调用``validateComponentName``对组件名称进行检查。

```javascript
export function validateComponentName (name: string) {
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    )
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}
```

``unicodeRegExp``的定义在``core/util/lang.js``中。

```javascript
/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
```

可见组件名称要满足下述两条规则：
1. 满足正则new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`)
2. isBuildInTag 和 config.isReservedTag判断不成立，即不能为Vue内置标签，不能为config中配置的保留标签

对于第一条规则，组件名称必须以字母开头，可以包含数字、-、.、_和有限的unicode字符。
对于第二条规则，isBuildInTag定义在``shared/util``中：

```javascript
/**
 * Check if a tag is a built-in tag.
 */
export const isBuiltInTag = makeMap('slot,component', true)
```

``makeMap``的定义为：

```javascript
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}
```
``makeMap``的逻辑比较简单，这里就不做解释了，``isBuildInTag``相当于：

```javascript
function isBuildTag (val) {
    const map = {
        component: true,
        slot: true
    };
    return map[val.toLowerCase()]
}
```
所以，component的名称不可以是``slot``和``component``。

``config.isReservedTag``的定义在``web/runtime/index.js``中。

```javascript {3}
// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement
```

而``isReservedTag``的定义在``web/util/element.js``中：

```javascript
export const isReservedTag = (tag: string): ?boolean => {
  return isHTMLTag(tag) || isSVG(tag)
}
export const isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
)

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
export const isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
)
```
所以，component名称不能是浏览器内置标签和SVG标签。

## 选项规范化
为什么要有规范化选项这一步骤呢？我们知道，Vue的许多配置项有多种形式,这使得API非常灵活，给予了开发者很多便利。但选项拥有多种配置方式，也给内部处理带来了一点麻烦。我们不可能针对每种方式都写个条件分支去处理，这无疑会使得代码变得冗余，为此需要对选项进行规范化，把传入的选项规范成同一种形式，便于后续的处理。

### props规范化(normalizeProps)
---

``normalizeProps``的源码在``core/util/options.js``中。

```javascript
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res
}
```
从注释可知，所有props语法最终都会转化为对象的形式。
假设props选项如下：

```javascript
    props: ['a', 'b']
```
则它会转化为(对应上面10-20行if分支逻辑):

```javascript
{
    a: {
        type: null
    }
}
```

当props为：

```javascript
    props: {
        a: String // 或 {type: String}
    }
```

会被转化为(对应上面21-29 else if分支逻辑)：

```javascript
{
    a: {
        type: String 
    }
}
```
同时props的key会使用``camelize``转化，该函数会将key转化为驼峰形式。最后，规范化的props会赋值给options.props。

### inject规范化(normalizeInject)
---

``normalizeInject``的源码在``core/util/options.js``中。

```javascript
/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options: Object, vm: ?Component) {
  const inject = options.inject
  if (!inject) return
  const normalized = options.inject = {}
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] }
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    )
  }
}
```

inject选项接受数组和对象两种配置方式，最终都会转化为如下形式:

```javascript
{
    key: {
        from: val,
        default: defaultValue // 指定默认值时
    }
}
```

### directives规范化(normalizeDirectives)
---

``normalizeDirectives``的源码在``core/util/options.js``中。

```javascript
/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options: Object) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}
```

directives配置的每个指令接受对象和函数两种配置方式，directive的规范化主要做的是将函数形式的指令配置转化为对象形式，将配置的函数转化为指令配置对象的``bind``和``update``属性，从而实现当指令只需要实现``bind``和``update``两个钩子时可以简写配置。

## extends和mixins的处理

做完选项的规范化之后就是``extends``和``mixins``两个选项的处理。

```javascript
// Apply extends and mixins on the child options,
// but only if it is a raw options object that isn't
// the result of another mergeOptions call.
// Only merged options has the _base property.
if (!child._base) {
    if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
        for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
        }
    }
}
```
从注释知道，只有合并了的options才有_base属性，为什么有这个结论呢？

我们知道Vue.options中有_base属性，并且``mergeOptions``第一个参数就是构造函数的options，所以，可以得出已经合并了的options必定有_base属性。

对于extends，递归调用``mergeOptions``，并把结果赋值给parent。

对于mixins，遍历mixins数组，对于每一项递归调用``mergeOptions``，并把结果赋值给parent。

## 合并选项

```javascript
const options = {}
let key
for (key in parent) {
    mergeField(key)
}
for (key in child) {
if (!hasOwn(parent, key)) {
    mergeField(key)
}
}
function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
}
return options
```
首先定义options，用于存储最终的结果。然后先合并parent中的选项，再合并只有child才有的选项。

我们知道，Vue有许多配置项，而对于不同选项，合并的方式也不同。如果使用条件判断的方式，那``mergeField``的实现将很长。Vue使用了策略模式，预定义了策略对象``strats``，该对象保存了对于不同选项的合并方法，通过选项的key可以取到对应的合并策略``strat``，从而进行合并。同时，使用条件判断的方式也不利于拓展，而使用策略模式，可以方便的通过配置Vue.config.optionMergeStrategies的方式给自定义选项配置合并策略。





