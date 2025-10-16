# ---- Base Image ----
FROM python:3.12-slim

# --- Environment Variablen ---
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_RUN_HOST=0.0.0.0 \
    FLASK_RUN_PORT=8000 \
    FLASK_APP=app.py \
    FLASK_DEBUG=1

# --- Arbeitsverzeichnis ---
WORKDIR /app

# --- Systemabhängigkeiten (optional, nur wenn du native Pakete brauchst) ---
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

# --- Requirements zuerst kopieren (für Cache) ---
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# --- App-Code kopieren ---
COPY . .

# --- Port freigeben ---
EXPOSE 8000

# --- Flask-Dev-Server starten ---
CMD ["flask", "run"]
