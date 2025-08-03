from flask import Flask, render_template, abort
import os

app = Flask(__name__)

# 定义HTML模板文件夹路径
TEMPLATE_FOLDER = os.path.join(os.path.dirname(__file__), 'templates')

# 确保模板文件夹存在
if not os.path.exists(TEMPLATE_FOLDER):
    os.makedirs(TEMPLATE_FOLDER)

@app.route('/')
def login():
    """登录路由"""
    try:
        return render_template('login.html')
    except:
        return "登录页面未找到", 404

@app.route('/home')
def home():
    """主页路由"""
    try:
        return render_template('home.html')
    except:
        return "主页页面未找到", 404

if __name__ == '__main__':
    # 开发环境使用debug=True，生产环境需改为False
    app.run(host='0.0.0.0', port=1314, debug=True)
