from flask import Flask, send_file
import os

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    return send_file(os.path.join(BASE_DIR, 'login.html'))

@app.route('/<path:path>')
def serve_static(path):
    file_path = os.path.join(BASE_DIR, path)
    if os.path.exists(file_path):
        if file_path.endswith('.html'):
            return send_file(file_path, mimetype='text/html')
        elif file_path.endswith('.css'):
            return send_file(file_path, mimetype='text/css')
        elif file_path.endswith('.js'):
            return send_file(file_path, mimetype='application/javascript')
    return '404 Not Found', 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)