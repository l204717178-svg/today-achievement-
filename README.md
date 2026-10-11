# 今日成就

把日常小事变成值得庆祝的隐藏成就。

独立移动端 Web Demo，使用 HTML、CSS 和原生 JavaScript。运行时不调用 AI、后端或远程 API，无需安装依赖或构建。

## 功能

- 从 16 项日常行为中选择 1—3 项。
- 逐枚揭晓成就卡，支持跳过动画与降低动态效果。
- 在当前浏览器保存本地图鉴。
- 本地生成并保存 1080×1440 PNG 分享图片。

R / SR / SSR 仅为趣味卡面装饰，不代表真实稀有度或生活价值高低。本作品非小红书官方产品。

## 本地运行

将仓库文件放在静态服务器中，入口为 `index.html`。

```sh
python3 -m http.server 8000
```

浏览器访问 `http://localhost:8000`。

## GitHub Pages

上传后，在仓库的 **Settings → Pages** 选择 **Deploy from a branch**，选择包含这些文件的默认分支与 **/ (root)**，保存后等待 GitHub 完成部署。实际网址以 Pages 页面显示为准。

## 验证范围

已验证桌面 Chrome 下的手机尺寸模拟、1—3 项流程、全部 16 项映射、PNG 下载、存储异常降级和键盘操作。真实手机 Safari / Android Chrome 应在部署后补测。

图鉴只保存在当前浏览器；清除浏览器数据、换设备或换站点地址不会同步。

GitHub Pages 预览链接不能替代笔试要求的 REDcowork 发布与作品链接提交。
