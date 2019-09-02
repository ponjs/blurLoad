# blurLoad
JavaScript 图片模糊加载

这是一个简单实现图片模糊加载的JS方法，第一次加载图片时，先加载缩略图，再加载大图，当大图加载完成后替换显示缩略图。这里我加入了识别图片主颜色设置成背景色方法，加载时有颜色背景渐变过渡效果。且再加载时去除模糊加载的延迟效果。

## Demo
[Live Example](https://demo.ponull.com/blurLoad/ "Live Example")

## Install
在HTML中引入JS文件
```html
<script type="text/javascript" src="blurLoad.min.js"></script>
```

## Usage
在`HTML`中添加具有以下属性的标签
```html
<figure class="blur-load" data-width="1920" data-height="1080" data-thumb="thumb.png" data-src="origin.png"></figure>
```

- `class`: 必须为`blur-load`
- `data-width`: 图像宽度比
- `data-height`: 图像高度比
- `data-thumb`: 缩略图地址
- `data-src`: 原图地址

然后在`JS`中只需一行代码即可执行
```javascript
blurLoad();
```