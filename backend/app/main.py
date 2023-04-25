import os
import json
import time
import openai

from typing import List
from fastapi import FastAPI, Query
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

API_BASE_URL = os.environ.get('API_BASE_URL')
openai.api_key = os.environ.get('OPENAI_KEY')

if(API_BASE_URL==None):
    API_BASE_URL="v1"

if(openai.api_key==None):
    openai.api_key="your chatgpt key here"
    

# Uniform history format
class History(BaseModel):
    role: str = ''
    content: str = ''


# Uniform request format
class ChatRequest(BaseModel):
    user_request: str = Query(None, max_length=2048)
    history: List[History] = []


# Uniform response format
class ChatResponse(BaseModel):
    message: str = ''
    history: List[History] = []


# modify the generate function is all you need
def chat_generate(request_data: ChatRequest):
    inputs = request_data['user_request']
    history = request_data['history']
    try:
        answer = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages= history + [{"role": "user", "content": inputs}]
        )
        message = answer["choices"][0]["message"]["content"]
        history += [{"role": "user", "content": inputs}, {"role": "assistant", "content": message}]
    except:
        message = 'error while calling ChatCompletion'
    return {'message': message, 'history': history}


# modify the experimental stream generate function is all you need
def experimental_chat_streamer(request_data: ChatRequest):
    inputs = request_data['user_request']
    history = request_data['history']
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= history + [{"role": "user", "content": inputs}],
        stream=True
    )
    message = ''
    for i in response:
        _message = i["choices"][0]["delta"].get('content')
        if _message:
            message += _message
            yield json.dumps({
                'message': message,
                'history': []
            }, ensure_ascii=False) + '\n'  # \n is used here for spliting json response
    history += [
        {"role": "user", "content": inputs}, 
        {"role": "assistant", "content": message}
    ]
    yield json.dumps({
        'message': message,
        'history': history
    }, ensure_ascii=False) + '\n'  # \n is used here for spliting json response


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 


@app.get("/list_user_endpoints")
def list_user_endpoints():
    fastapi_endpoints = [
        'openapi', 'swagger_ui_html', 'swagger_ui_redirect', 'redoc_html',
        'list_user_endpoints'
    ]
    endpoint_list = [
        route.path for route in app.routes
        if route.name not in fastapi_endpoints
    ]
    return endpoint_list


@app.post(f"/{API_BASE_URL}/ask",
          summary="Send a text request and return an text answer",
          response_model=ChatResponse)
def ask(request_data: ChatRequest):
    return chat_generate(jsonable_encoder(request_data))


@app.post(f"/{API_BASE_URL}/stream_ask",
          summary="Send a text request and return an steaming answer",
          response_model=ChatResponse)
async def stream_ask(request_data: ChatRequest):
    return StreamingResponse(experimental_chat_streamer(jsonable_encoder(request_data)),
                             media_type='text/plain')


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004, log_level="debug")