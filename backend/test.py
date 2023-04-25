import json
import requests

url = "http://localhost:8004/stream_ask"
headers = {'Content-Type: application/json'}
data = {
  "user_request": "test",
  "history": []
}

with requests.post(url, json=data, stream=True) as r:
    for chunk in r.iter_lines():  # or, for line in r.iter_content():
        if chunk:
            print(chunk.decode('utf-8'))