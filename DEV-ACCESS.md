# 本地开发访问说明

## 电脑本机访问

启动后在电脑浏览器打开：

```text
http://localhost:5173/
```

## iPad / 手机访问方式

1. 电脑和 iPad/手机连接同一个 Wi-Fi。
2. 在 Mac 终端执行：

```bash
ipconfig getifaddr en0
```

3. 得到类似 `192.168.x.x` 的地址。
4. 在 iPad/手机浏览器打开：

```text
http://192.168.x.x:5173/
```

## 启动命令

```bash
npm run dev:host
```

## 如果端口被占用

先关闭之前的 dev server，或执行：

```bash
lsof -i :5173
```

找到对应 PID 后执行：

```bash
kill <PID>
```

## 推荐操作

在 iPad Safari 打开成功后，可以：

```text
分享按钮 -> 添加到主屏幕
```

以后孩子点图标即可进入，但前提是 Mac 上 `npm run dev:host` 正在运行。
