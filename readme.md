!support linux and windows!
## 截图

<img src="https://github.com/user-attachments/assets/70c4b599-0cb0-4ed1-9fad-ae52b06fecd7" alt="image" width="600"/>



## 简介
1.  启动一个 web 服务
2.  提供文本\图片\文件 存储功能
3.  和任何内网能使用浏览器的设备分享
4.  速度超快（内网）
5.  windows启动操作便捷
6.  AI 写的,没有考虑安全性问题,勿部署公网

## 安装启动方法
1. 顶部action页面下载最新的build，按照自己的系统版本选择，如 lanclip-windows-x64.1.zip
2. 解压后启动 start.exe
3. 在 Windows 右下角托盘右键可以打开网址/退出程序



## 使用方法
1. 在电脑上打开他的地址 http://127.0.0.1:5000
2. 在手机/其他电脑上打开它的内网地址 http://192.168.31.90:5000/
3. 点击刷新按钮同步内容


## FAQ
我想自定义端口启动 参考 [issue1](https://github.com/cornradio/LANwebclipboard-win-flask/issues/1)

---

下面是高级配置


## 额外可配置项
1. 修改 LAN_clipboard_app/_internal/static/main.js 的 imageUrls ，可以更换图片背景列表

## nginx转发配置 for ubuntu
因为默认开放的是 5000端口，而且是ipv4 only ，不是很方便。
下面的配置可以使 用nginx 进行本地转发，通过80开放公网ipv4、v6访问。

修改文件：/etc/nginx/sites-enabled/default 
```js
server {
    listen 80;              # 监听 IPv4
    listen [::]:80;         # 监听 IPv6
    client_max_body_size 2000m;  #最大转发2G文件存储
    # server_name your_domain_or_ip;  # 替换为你的域名或 IP 地址

    location / {
        proxy_pass http://127.0.0.1:5000/;  # 转发请求到本地5000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
重启nginx

## 启动服务指南 for ubuntu
可以保存为 lanclipupdate.sh
```sh
#!/bin/bash
screen -S lanclip -X quit
# 切换到主目录
cd ~
# 删除旧的应用文件和 zip 文件
rm -rvf LAN_clipboard_app/
rm -rvf lanclip-ubuntu-x64.zip

# 提示等待用户手动上传 lanclip-ubuntu-x64.zip
echo "https://github.com/cornradio/LANwebclipboard-win-flask/actions"
echo "请手动上传 lanclip-ubuntu-x64.zip 并按回车键继续..."
read

# 等待用户上传 lanclip-ubuntu-x64.zip
while [ ! -f lanclip-ubuntu-x64.zip ]; do
  echo "正在等待文件上传... "
  sleep 1
done

# 解压文件
unzip lanclip-ubuntu-x64.zip


# 进入文件夹
cd LAN_clipboard_app

# 启动应用程序
# 创建一个新的 lanclip 会话并在后台运行
# 向 lanclip 会话发送命令，在后台执行 ./LAN_clipboard_app
screen -dmS lanclip
screen -S lanclip -p 0 -X stuff './LAN_clipboard_app\n'

# 提示用户如何退出 screen 会话
echo "应用程序已在后台运行，通过 screen -r lanclip 查看状态"
```





