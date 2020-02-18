# 子组件选项合并

前面两节将的是我们直接调用new Vue时的选项合并逻辑，这节我们来探索一下Vue内部在创建子组件时的选项合并逻辑。

当Vue在实例化组件实例时，会进入下面这个分支逻辑：

``core/insance/init.js``

```javascript
//Vue.prototype._init
if (options && options._isComponent) {
  // optimize internal component instantiation
  // since dynamic options merging is pretty slow, and none of the
  // internal component options needs special treatment.
  // 组件化时调用
  initInternalComponent(vm, options)
}
```

``initInternalComponent``的定义为：

```javascript
// 在core/instance/init.js中
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

``vm.constructor.options``是什么呢？

Vue在组件化时会调用Vue.extend生成子组件构造器，然后再用子构造器实例化组件实例，所以这里的``vm.constructor``即子组件构造器。而Vue.extend在生成子构造器的时候会把父构造器的options和组件选项进行上一节的mergeOptions操作，即下面的代码：

```javascript
Sub.options = mergeOptions(
  Super.options,
  extendOptions
)
```

所以``opts``——vm.$options为以子构造器的options为原型的对象。``initInternalComponent``的合并逻辑比较简单，首先创建vm.$options对象，然后就是简单的属性复制，将占位vnode、父组件实例，父组件传入的props、监听器、slot、组件的tag以及render和staticRenderFns(存在的话)保存在vm.$options中。

因此，子组件选项合并分两步：

    1. Vue.extend生成子构造器时的mergeOptions操作
    2. 实例化子组件实例时的属性复制