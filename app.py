# File Upload Flask Server
# by Shadowdara 2025 MIT

import os
import time
import threading

from flask import Flask, jsonify
from flask_cors import CORS
from flask import send_from_directory
from flask import Flask, request
from werkzeug.utils import secure_filename

import core
import db
import worker

app = Flask(__name__)
CORS(app)  # erlaubt Zugriff von externen Domains

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

db_list = db.load_db()
uploaded_files = {
    item["path"]: (item["time"], item["lifetime"])
    for item in db_list
}

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

# Calculate Datazize
@app.route('/api/get_data_information')
def get_size():
    size, file_count = worker.get_folder_info(UPLOAD_FOLDER)
    return jsonify({
        'size': size,
        'file_count': file_count,
    })

def save_uploaded_files():
    # Hilfsfunktion um Memory -> JSON zu speichern
    db_list = [
        {"path": k, "time": v[0], "lifetime": v[1]} for k, v in uploaded_files.items()
    ]
    db.save_db(db_list)

# Upload annehmen
@app.route('/api/uploads', methods=['POST'])
def upload():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'Keine Datei hochgeladen'}), 400

    # Ablaufzeit (optional, default 0)
    d = int(request.form.get('d', 0) or 0)
    h = int(request.form.get('h', 0) or 0)
    m = int(request.form.get('m', 0) or 0)
    s = int(request.form.get('s', 0) or 0)

    checksum = core.getchecksum()

    lifetime = int(s) + int(m) * 60 + int(h) * 3600 + int(d) * 86400

    folder_path = os.path.join(app.config["UPLOAD_FOLDER"], checksum)
    
    os.makedirs(folder_path, exist_ok=True)

    filename = secure_filename(file.filename)
    filepath = os.path.join(checksum, filename)
    file.save(filepath)

    upload_time = time.time()
    key = filepath  # Du kannst hier auch Ordnerstruktur oder Hash einbauen

    uploaded_files[key] = (upload_time, lifetime)
    save_uploaded_files()

    return jsonify({
        'filename': filename,
        'sha_checksum': checksum
    }), 200

# For the static HTML and CSS files
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('static', path)

# To Download the files
@app.route('/uploads/<path:path>')
def download_files(path):
    return send_from_directory('uploads', path)

def cleanup_loop():
    while True:
        now = time.time()
        expired = []

        for key, (upload_time, lifetime) in list(uploaded_files.items()):
            if lifetime > 0 and (now - upload_time > lifetime):
                filepath = os.path.join(app.config["UPLOAD_FOLDER"], key)
                try:
                    os.remove(filepath)
                    print(f"🗑️ Datei gelöscht: {filepath}")
                except FileNotFoundError:
                    print(f"⚠️ Datei nicht gefunden: {filepath}")
                expired.append(key)

        # Aus Memory entfernen
        for key in expired:
            uploaded_files.pop(key, None)

        if expired:
            save_uploaded_files()

        time.sleep(600)  # alle 10 Minuten

if __name__ == '__main__':
    threading.Thread(target=cleanup_loop, daemon=True).start()
    app.run(debug=True, port=5000)
