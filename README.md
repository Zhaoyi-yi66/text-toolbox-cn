# 文本工具台

一个可直接在浏览器使用的中文文本工具：

- 清理空行、零宽字符、特殊空格和行尾空格
- 合并从微信、Word、PDF 或网页复制时产生的硬换行
- 清除 Markdown 标记、删除重复行并保护代码块
- 小红书排版
- 本地 AI 味体检与逐句提示
- 调用 WorkBuddy Cloud 的云端 AI 进行整体改写

文本清洗和 AI 味体检均在浏览器本地运行。只有用户主动点击“一键降 AI 味”时，输入内容才会发送到页面中已配置的 WorkBuddy Cloud 服务。

## 本地使用

直接打开 `public/index.html`，或运行任意静态文件服务器并以 `public` 为站点目录。

## 发布

```bash
npm run deploy
```

## 在线地址

https://text-toolbox-cn.sitemap-huoqu.workers.dev/

