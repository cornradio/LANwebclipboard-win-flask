## 简介
它可以快速的在 Windows 电脑上启动一个 web 服务. 向内网开放.  
web页面提供文本\图片\文件 临时存储功能 ; 

## 截图
![image](https://github.com/user-attachments/assets/f740bab8-6ab7-4879-bbd7-c5cc8ed87630)
右下角托盘快捷菜单
![image](https://github.com/user-attachments/assets/939690bf-72b8-4839-8677-52a182eff5c9)
页面截图
![image](https://github.com/user-attachments/assets/8eadd4a8-e10f-42c4-9d42-2dea9af535cb)


整理一下这个项目用到的所有包
需要的 Python 版本
需要外安装的包

1. Python 3.6
2. Flask


如何将这个程序打包成一个 exe 文件, 并且可以运行
```
pyinstaller --name=clipboard_app --add-data "templates;templates" --add-data "static;static" app.py -y
```
