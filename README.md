# 校里有 XLY

完整站点位于 public/。在项目目录运行以下命令，然后打开 http://localhost:8787/ 。

```sh
python3 -m http.server 8787 --directory public
```

## 上线服务

编辑 public/apps-config.js。复制一项并指定唯一 id，填写 name、description 和本地图标 icon。图标路径相对于 public/，自定义图标请放在 icons/。order 数值越小越靠前，visible 为 false 会隐藏入口。color 支持 peach、honey、mint、rose。

将业务方提供的完整 HTTP 或 HTTPS 地址原样填入 url，并将 enabled 设为 true。端口、路径和查询参数都可保留。未启用、地址为空或协议无效时，页面展示「即将上线」。浏览器报告离线时，已上线入口会显示「需联网」。englishName 配置中文标题下的英文名称，status 支持 launched 和 planned。当前宿舍打印已配置直达地址，其他入口点击后显示顶部轻提示。

## 部署至 Cloudflare Pages

在 Workers & Pages 创建 Pages 项目，选择直接上传，拖入 public 文件夹并部署。确保上传目录的第一层就是 index.html。更新时在同一项目新建部署并再次上传整个目录。使用 Git 集成时选择无框架预设，构建命令留空，输出目录填 public。

[Cloudflare 直接上传文档](https://developers.cloudflare.com/pages/get-started/direct-upload/)

## 安装与缓存验证

通过 HTTPS 打开部署站点。iOS Safari 通过分享菜单选择「添加到主屏幕」，如有「作为网页 App 打开」选项，请开启。Android Chrome 通过菜单选择「安装应用」或「添加到主屏幕」。

普通 PNG 自带透明圆角，Apple Touch Icon 使用不透明底色，由 iOS 裁成系统圆角。Android maskable 图标保留安全区，最终轮廓跟随启动器设置。

1. 联网打开首页，Chrome 开发者工具 Application 中检查 Manifest、图标与 activated 的 Service Worker。
2. 在 Cache Storage 中确认 xly-shell 缓存包含 HTML、脚本、样式和本地图标。
3. 切换 Network 为 Offline 后正常刷新。应看到猫咪、四个入口、继续走动的时钟和离线提示。切回 Online 后提示消失。
4. 修改配置并重新部署，联网正常刷新后应出现新内容。首页和静态资源联网时重新校验，断网时回退到缓存。新增本地图标首次联网请求后可缓存。若需首次访问即预缓存新增文件，将它加入 sw.js 的 files 并递增 version。更改预缓存清单时同样递增版本，激活后会清理旧版本。外部业务请求不进入缓存。

## 本地浏览器自检

Chrome 实测 1440×900 与 1024×768 为四列，768×1024 为两列，844×390 横屏为三列，390×844 为两列，320×568 为单列。各尺寸均渲染四项且无横向溢出。断网后刷新成功，四项入口及图标完整，页面显示离线提示。iOS 和 Android 真机安装外观仍需在部署后的设备上验收。
