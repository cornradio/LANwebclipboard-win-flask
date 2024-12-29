# 测试

flask run --debug --host=0.0.0.0

# 打包

## 打包程序本体 win
```
pyinstaller --name=clipboard_app --add-data "templates;templates" --add-data "static;static" app.py -y
```

## 打包程序本体 linux
```
pyinstaller --name=clipboard_app --add-data "templates:templates" --add-data "static:static" app.py -y
```

## PACK apploader
```
pyinstaller --name=apploader apploader.py -y
```

## 打包后清理文件
```
git clean -fdX
```