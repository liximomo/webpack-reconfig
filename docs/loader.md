## Loader

使用方式:
`Inst(id, loaderConfig, slotOption)`

根据配置自动实例化对象

### id

类型: string

### loaderConfig

类型: object

当使用 id 作为 loader 名字时, loaderConfig 可以作为 loader 的 options 选项, 否则和 webpack 的 loader 配置相同,

### slotOption

类型: object

参考 Slot.option.

推荐使用方式:
```js
Loader('style-loader'),
Loader('url-loader', {
  limit: 10000,
  name: 'media/[name].[hash:8].[ext]',
})
```

复杂的写法:
```js
Loader('my-url-loader', {
  loader: 'url-loader',
  options: {
    limit: 10000,
    name: 'media/[name].[hash:8].[ext]',
  }
})
```
