# Vue项目目录设计
```
.
├── BACKERS.md
├── LICENSE
├── README.md
├── benchmarks
├── dist # 打包文件存放目录
├── examples # 示例文件
├── flow # flow类型声明文件
├── package.json
├── packages
├── scripts # 构建脚本
├── src # 源码目录
├── test # 测试脚本
├── types # ts声明文件
```
源码存放在src目录下

```
src
.
├── compiler 
├── core 
├── platforms 
├── server 
├── sfc 
├── shared 
```

## compiler
compiler目录包含模板编译相关代码，包括把模板编译成ast语法树(parser)、ast语法树优化(optimizer.js)、代码生成(codegen)。

## core
core目录包含Vue框架的核心代码，包括响应式原理、虚拟dom、补丁算法、内置组件、全局api等

## platform
平台相关代码，包括web平台和weex平台

## server
server目录存放了vue.js服务端渲染相关代码

## sfc
sfc目录下的代码会将.vue文件解析为一个JS对象

## shared
shared目录下存放一些工具函数。
