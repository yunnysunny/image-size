# 基于node-webkit的图片缩放工具
本来想找一个图片放大工具，结果发现网上的工具球全都是收费的，一怒之下，决定自己写一个。
当前工具基于[node-webkit](http://nwjs.io/)开发，所以说应用程序有些大。同时为了能够正确运行
程序，你还需要安装[ImageMagick](http://www.imagemagick.org/)。
## 下载
为了方便大家体验，特意把生成的二进制程序放到百度云上，地址http://pan.baidu.com/s/1hsxwoIw 。
程序中依赖的ImageMagick的下载地址：

- win32 http://www.imagemagick.org/download/binaries/ImageMagick-6.9.3-7-Q16-HDRI-x86-dll.exe
- win64 http://www.imagemagick.org/download/binaries/ImageMagick-6.9.3-7-Q16-HDRI-x64-dll.exe

## 打包
如果想自己打包程序，在命令行下进入源码目录，运行`npm install`,安装grunt模块，然后进入`www`目录，运行
`npm install`安装应用程序所需的模块，最后回到源码根目录，运行`grunt`，即可打包程序。
## 协议
[MIT](https://opensource.org/licenses/MIT)