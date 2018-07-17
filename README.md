## 要解决的问题.

* 数组作为配置值，配置难以合并。
* 使用复杂对象（插件）， 难以合并选项及实例。

## 方案

* 使用对象而非数组 + 对象数组展开算法
* 通过对象字面量(Object Literal) + 自动加载模块，动态生成实例


### 对象实例化
```
{
  name: string // module name
  module: function // 手动 require module
  option: any // 单参构造函数传值
  options: any[] // 多参构建函数传值
}
```

`module` 没有定义时, 自动从 `name` 推倒生成.

### 对象数组展开

```
{
  'foo': {
    value,
    $order: '',
  },
  'bar': {
    value,
    $order: '',
  },
  'zoo': {
    value,
    $order: '',
  },
  'zar': {
    value,
    $order: '',
  }
}
```
## Rule
```js
rules: [
  [<key>, <config>]
]
```

### Rule Key
```
key => ruleName$id
``` 

如果 `config` 中不存在 `test`, 则自动生成规则为匹配以 `ruleName` 为后缀的正则作为 `test`.

### Rule Config
同 webpack rule.


## 插件
```js
plugins: [
  [<key>, <config>]
]
```

### 插件 Key
```
key => pluginName$id
``` 

插件标识, 由 简写或全写的插件名+可选的插件实例标识.

#### key 解析规则

##### 插件名解析
`pluginName` 转化成 `plugin-name` 的形式, 并添加 `webpack-plugin` 后缀.

示例:

* html -> html-webpack-plugin
* uglifyjs -> uglifyjs-webpack-plugin
* cleanWebpackPlugin -> clean-webpack-plugin

如果某些特定的插件没有遵循 `webpack-plugin` 插件的命名约定, 则请使用插件原始的完整模块名:

```js
// 插件模块名为 myCustomPlugin
'myCustomPlugin': { option: 'value' }
```

##### 插件实例标识
一个插件可以有多个实例, 可以使用 `$name` 的形式来标识具体的实例:

```js
{
  'clean': {
    option: 'dist/default',
  },
  'clean$app1': {
    option: 'dist/app1',
  }
}
```

### 插件 Config

#### config.option
类型: any

用来实例化插件的选项

#### config.options
类型: Array<any>

使用一个数组为插件提供多个初始化参数
