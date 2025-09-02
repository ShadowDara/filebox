import json
import threading

DB_FILE = "db.json"
lock = threading.Lock()  # Thread-sicher schreiben

def load_db():
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_db(data):
    with lock:
        with open(DB_FILE, "w") as f:
            json.dump(data, f, indent=2)
