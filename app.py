import os
import sys
import shutil
from flask import Flask, render_template, request, send_from_directory
import clipboard
import os
import socket
import webbrowser
from threading import Timer

def resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

# 获取程序运行目录
def get_app_path():
    if hasattr(sys, '_MEIPASS'):
        return os.path.dirname(sys.executable)
    return os.path.abspath(".")

app = Flask(__name__,
           template_folder=resource_path('templates'),
           static_folder=resource_path('static'))

STORAGE_FILE = 'cards.txt'


def load_cards():
    try:
        if os.path.exists(STORAGE_FILE):
            with open(STORAGE_FILE, 'r', encoding='utf-8') as f:
                return [line.strip() for line in f.readlines() if line.strip()]
    except Exception as e:
        print(f"加载卡片出错: {str(e)}")
    return []

def save_cards(cards):
    try:
        with open(STORAGE_FILE, 'w', encoding='utf-8') as f:
            for card in cards:
                f.write(f"{card}\n")
    except Exception as e:
        print(f"保存卡片出错: {str(e)}")

# 支持post 图片 ， 并且保存图片到 images文件夹，返回图片的url
@app.route('/upload', methods=['POST'])
def upload_image():
    image = request.files.get('image')
    if image:
        images_dir = os.path.join(get_app_path(), 'images')
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)
        image.save(os.path.join(images_dir, image.filename))
        return f'/images/{image.filename}'
    return '上传失败'

@app.route('/', methods=['GET', 'POST'])
def home():
    cards = load_cards()
    
    if request.method == 'POST':
        new_text = request.form.get('text', '')
        if new_text:
            if new_text in cards:
                cards.remove(new_text)
            cards.insert(0, new_text)
            save_cards(cards)
    
    return render_template('index.html', cards=cards, port=5000)

# 现在系统没有办法get images/ 需要增加相关路由
@app.route('/images/<path:filename>')
def get_image(filename):
    images_dir = os.path.join(get_app_path(), 'images')
    return send_from_directory(images_dir, filename)


@app.route('/clear', methods=['POST'])
def clear_history():
    # 清空文本记录
    storage_path = os.path.join(get_app_path(), STORAGE_FILE)
    with open(storage_path, 'w', encoding='utf-8') as f:
        f.write('')
    
    # 清空图片文件夹
    images_dir = os.path.join(get_app_path(), 'images')
    if os.path.exists(images_dir):
        for file in os.listdir(images_dir):
            os.remove(os.path.join(images_dir, file))
    
    return '', 204

def open_browser():
    webbrowser.open('http://127.0.0.1:5000')

if __name__ == '__main__':
    # 在程序启动时清理文件
    if os.path.exists(STORAGE_FILE):
        os.remove(STORAGE_FILE)
        with open(STORAGE_FILE, 'w', encoding='utf-8') as f:
            f.write('')  # 创建一个空文件
    app.run(host='0.0.0.0', port=5000, debug=False) 