## Inst
使用方式:
`Inst(config)`

根据配置自动实例化对象

### config.initiator
类型: string | function

构建函数
```js
// string
Inst({
  initiator: 'webpack->DefinePlugin'
})
Inst({
  initiator: 'vue-loader/lib/plugin''
})

// function
const webpack = require('webpack');
Inst({
  initiator: webpack.DefinePlugin
})
```

### config.option
类型: object

传递给构造函数的参数, 如果构建函数接受多个参数, 请使用 `options`

### config.options
类型: object[]

传递给构造函数的参数
