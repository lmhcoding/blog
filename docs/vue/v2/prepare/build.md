# Vue 源码构建

``package.json``中有这么一段代码：
```json
{
    "scripts": {
        "build": "node scripts/build.js",
        "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
        "build:weex": "npm run build -- weex",
    }
}
```

当运行``npm run build`` 或者 ``yarn build``命令时，实际上执行的是``node scripts/build.js``命令，最终运行的是build.js文件里的build函数。

```javascript
let builds = require('./config').getAllBuilds()
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}
build(builds)
function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}
```

这段代码先导入所有的构建配置，然后通过命令行参数对构建配置进行过滤，从而构建不同用途的vue。
打开scripts/config文件，

```javascript
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.dev.js'),
    format: 'cjs',
    env: 'development',
    banner
  },
  'web-runtime-cjs-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.prod.js'),
    format: 'cjs',
    env: 'production',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.dev.js'),
    format: 'cjs',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  'web-full-cjs-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.prod.js'),
    format: 'cjs',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime only ES modules build (for bundlers)
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler ES modules build (for bundlers)
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  ...
}
```

以上是不同用途的vue的构建配置，各个配置项的用途自行查看[rollup](https://rollupjs.org/guide/en/),下面以web-full-esm为例，它的入口为``entry: resolve('web/entry-runtime-with-compiler.js'),``,resolve的定义为：

```javascript
const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
```

resolve函数将传入的路径从字符``/``处切开，取第一个作为base，(在这个例子中，base为web)然后使用base获取别名配置中base对应的路径，
并与传入路径除去base的剩余部分合成最终路径。别名配置在``scripts/alias``文件中。

```javascript
const resolve = p => path.resolve(__dirname, '../', p)
module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  sfc: resolve('src/sfc')
}
```

可见， web对应的路径为path.resolve(__dirname, '../', 'src/platforms/web'),所以最终的入口为，``src/platforms/web/entry-runtime-with-compiler.js``,rollup打包后会在dist目录下生成vue.esm.js。


