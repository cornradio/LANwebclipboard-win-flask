## 截图

<p align="center">
    <img src="https://github.com/user-attachments/assets/6b931973-64b4-4ecc-90ef-03ead1dbce8c" width="75%" style="display: inline-block; vertical-align: top;">
    <img src="https://github.com/user-attachments/assets/29b0fc19-857c-46af-92af-6ac5b8c3ed0c" width="25%" style="display: inline-block; vertical-align: top;">
</p>


## 简介
1.  启动一个 web 服务
2.  提供文本\图片\文件 存储功能
3.  和任何内网能使用浏览器的设备分享资源
4.  速度超快（内网）
5.  windows 可以启动成托盘，操作便捷
6.  链接会自动变成可点击的超链接

## 安装启动方法

### windows - EXE
在release页面下载并启动exe

### Docker（服务器部署）

```sh
# dockerhub 镜像
docker run -d -p 5000:5000 kasusa/lan-clipboard-app:latest

# 阿里云镜像
docker run -d -p 5000:5000 registry.cn-hangzhou.aliyuncs.com/aaas-images/lan-clipboard-app:latest
```

### 通过源码运行
> 目前mac上发现打包脚本有问题，无论如何都不能正确打包，只能手动跑。
> 
```
flask run  --host=0.0.0.0 --port 5002
```

## 使用方法
1. 打开地址 http://127.0.0.1:5000
2. 存放临时文本/文件/图片。
3. 在其他设备上打开它的地址如 http://192.168.31.90:5000/
4. 内容不同步时，点击刷新按钮同步内容


## FAQ
想自定义端口启动 参考 [issue1](https://github.com/cornradio/LANwebclipboard-win-flask/issues/1)







