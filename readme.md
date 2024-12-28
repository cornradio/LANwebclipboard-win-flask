整理一下这个项目用到的所有包
需要的 Python 版本
需要外安装的包

1. Python 3.6
2. Flask


如何将这个程序打包成一个 exe 文件, 并且可以运行
```
pyinstaller --name=clipboard_app --add-data "templates;templates" --add-data "static;static" app.py -y
```