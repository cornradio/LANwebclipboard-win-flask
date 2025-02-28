!support linux and windows!
## 截图

<img src="https://github.com/user-attachments/assets/70c4b599-0cb0-4ed1-9fad-ae52b06fecd7" alt="image" width="600"/>

## 简介
1.  启动一个 web 服务
2.  提供文本\图片\文件 存储功能
3.  和任何内网能使用浏览器的设备分享资源
4.  速度超快（内网）
5.  windows 可以启动成托盘，操作便捷
6.  链接会自动变成可点击的超链接

## 安装启动方法
### windows - EXE
1. 在release页面下载
2. 解压后启动 start.exe
3. 在 Windows 右下角托盘 - 右键，可以打开网址/退出程序

### Docker
服务器部署也推荐使用 docker

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
1. 在电脑上打开他的地址 http://127.0.0.1:5000
2. 通过拖动/粘贴、上传文件\图片、记录文字等。
3. 在手机/其他电脑上打开它的内网地址 http://192.168.31.90:5000/
4. 点击刷新按钮同步内容


## FAQ
我想自定义端口启动 参考 [issue1](https://github.com/cornradio/LANwebclipboard-win-flask/issues/1)

---

# 高级配置

## 额外可配置项
1. 背景图片 ： 修改 LAN_clipboard_app/_internal/static/main.js 的 imageUrls ，可以更换背景图片列表

## nginx 转发配置 for ubuntu （ipv6）
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

> 自从上传了docker之后我就很少用这种方式了。
> 不过这个也有优点，就是查看上传的文件比较方便。
>

可以保存为 lanclipupdate.sh  
首次安装版
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

更新版
```
#!/bin/bash
screen -S lanclip -X quit
# 切换到主目录
cd ~
# 复制文件作为备份 LAN_clipboard_app/cards images uploads
mkdir -p LAN_clipboard_app_backup
cp -rv LAN_clipboard_app/cards/ LAN_clipboard_app_backup/cards/
cp -rv LAN_clipboard_app/images/ LAN_clipboard_app_backup/images/
cp -rv LAN_clipboard_app/uploads/ LAN_clipboard_app_backup/uploads/

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

# 将备份文件复制回 LAN_clipboard_app 下的对应文件夹
cp -rv LAN_clipboard_app_backup/cards/ LAN_clipboard_app/cards/
cp -rv LAN_clipboard_app_backup/images/ LAN_clipboard_app/images/
cp -rv LAN_clipboard_app_backup/uploads/ LAN_clipboard_app/uploads/


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





