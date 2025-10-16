# Upload Box

a little file upload Server written in Flask and Preact to
upload Files to send a share link which will run out after
some Time

## Using

Clone the Repo and build the Dockercontainer
```sh
git clone https://github.com/ShadowDara/filebox.git
docker compose up

# Default Link
# http://0.0.0.0:8000
```

or run

```sh
git clone https://github.com/ShadowDara/filebox.git
pip install -r requirements.txt
python app.py

# Default Link
# http://127.0.0.1:5000
```

Link and Port can be overwritten with an ENV Var

## Develeping

i included the dist folder into the Repo because this would make using
the server much easier with just cloning the Repository

to start run
```sh
cd frontend
npm install

npm run build

cd ..

python -m venv venv
venv/scripts/Activate

pip install -r requirements.txt

python app.py
```
