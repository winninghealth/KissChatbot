[README] [[中文说明]](README_CN.md)
# KissChatbot
A chatbot application is built using [Nobita-chatbot](https://github.com/hashmat-noorani/Nobita-chatbot/tree/main/client) as frontend and FastAPI as python backend. KISS, an acronym for "Keep it simple, stupid!" which is known as [KISS principle](http://https://en.wikipedia.org/wiki/KISS_principle).

## Description
This is a chatbot application that allows users to interact with a virtual assistant supported by large language models (LLM). KissChatbot is designed to answer questions and provide information just like ChatGPT.

The application is built using react-app for the frontend and Python for the backend components. This design is particularly user-friendly for Python developers, as it enables them to quickly deploy their trained models without dealing with the front-end.

In KissChatbot, we mock a demo service utilizing chatgpt3.5 model and it requires configuration of an OpenAI key. Of course, the backend service can be simply modified to employ any other models.

## Features
- Privacy first, all data is stored locally in the browser.

- The interface supports two response modes: streaming and non-streaming.

- Supports syntax highlighting and formatting for various programming languages.

- Customizable chatbot responses and behavior

- Responsive user interface that works on desktop and mobile devices

## Getting Started

To run this application locally, you need to install Python environment on your computer. After installing the necessary dependencies, follow these steps:

  **Backend:** 

1. Clone the repository onto your local computer. 

2. Navigate to backend/app/main.py.

3. Configure your ChatGPT key.

4. install the OpenAI dependencies.

5. Run this Python file to start the backend server. 

6. Open a web browser and navigate to http://localhost:8004/docs to view the API documentation.

 **Frontend:** 

1. Navigate to the frontend directory and run npm install to install the frontend dependencies.

2. Run npm start to start the frontend development server. 

3. Open a web browser and navigate to http://localhost:3000 to view the application.

 **Manual Configuration:** 

1. frontend/public/config.js is the configuration file for calling the API, which can be modified according to       actual needs.

2. The default configuration is: window.config = {"askRole":"user", "answerRole":"assistant", "apiIP":"http://localhost:8004"}

3. askRole and answerRole are parameters for the API content, used by the frontend to retrieve content from the API, and must match the attributes of the API return content property. 

4. apiIP is the service address.

## Docker-compose deployment [Recommend]

Deploy the project through Docker. Docker-Compose has already configured the frontend and server-related settings, which can be modified.

1. Configure the `OPENAI_KEY`Open the `Docker-Compose.yml` file to modify and save.

2. Switch to the root directory.

3. Manually modify the API configuration file frontend/public/config.js, the default configuration is: window.config={"askRole":"user","answerRole":"assistant","apiIP":"http://localhost:8004"}

4. modify the apiIP to "/api".

5. Run "docker-compose up". 

6. Open your web browser and navigate to http://localhost:8006 to view the application. 

7. Open http://localhost:8005/docs to view the API documentation.

## Usage
To use the chatbot, simply enter a message in the chat window and press enter. The chatbot will respond with a message based on the user's input. The following functions are also supported：

1. Provides multi-turn conversation with an option to turn it off.

2. Chat records are permanently stored in the browser.

3. Download chat records as images.

## Screenshot

### Desktop View

#### Home Page

 ![home-dv](\/assets\/home-dv.png)

#### Chat Container

 ![chat-dv](\/assets\/chat-dv.png)                             

### Mobile View                                                       

#### Home Page

 ![home-mv](\/assets\/home-mv.png)

#### Drawer

 ![drawer-mv](\/assets\/drawer-mv.png)  

#### Chat Container

 ![chat-mv](\/assets\/chat-mv.png) 

## Contributing
Contributions are welcome! If you would like to contribute to this project, please fork the repository and submit a pull request.

## License
This project is licensed under the Apache License 2.0.