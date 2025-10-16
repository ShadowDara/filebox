# Upload Box

a little file upload Server written in Flask and Preact to
upload Files to send a share link which will run out after
some Time

## Using

Clone the Repo and build the Dockercontainer
```sh
docker compose up
```

or run

```sh
pip install -r requirements.txt
python app.py
```

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
