[[README]](README.md) [中文说明]

# KissChatbot

聊天机器人应用程序是使用[Nobita-chatbot](https://github.com/hashmat-noorani/Nobita-chatbot/tree/main/client)作为前端和FastAPI作为python后端构建的。KISS，"Keep it simple, stupid!"的首字母缩写，被称为[KISS原则](http://https//en.wikipedia.org/wiki/KISS_principle)。

## Description
这是一个聊天机器人应用程序，允许用户与大型语言模型 （LLM） 支持的虚拟助手进行交互。KissChatbot旨在回答问题并提供信息，就像ChatGPT一样。

该应用程序是使用react-app构建的前端和Python的后端组件。这种设计对于 Python 开发人员来说特别用户友好，因为它使他们能够快速部署经过训练的模型，而无需处理前端。

在KissChatbot中，我们使用chatgpt3.5模型模拟演示服务，它需要配置OpenAI密钥。当然，可以简单地修改后端服务以采用任何其他模型。

## Features
- 隐私第一，所有数据都存储在本地浏览器中。
- 该接口支持两种响应模式：流式处理和非流式处理。
- 支持各种编程语言的语法突出显示和格式设置。
- 可定制的聊天机器人响应和行为
- 适用于桌面和移动设备的响应式用户界面

## Getting Started

要在本地运行此应用程序，您需要在计算机上安装 Python 环境。安装必要的依赖项后，请按照下列步骤操作：

  **后端：**

1. 将存储库克隆到本地计算机上。
2. 导航到backend/app/main.py 。
3. 配置您的 ChatGPT 密钥。
4. 安装 OpenAI 依赖项。
5. 运行此 Python 文件以启动后端服务器。
6. 打开 Web 浏览器并导航到 http://localhost:8004/docs 以查看 API 文档。

**前端：**

1. 导航到frontend目录并运行 npm install 以安装前端依赖项。
2. 运行 npm start 以启动前端开发服务器。
3. 打开 Web 浏览器并导航到 [http://localhost:3000](http://localhost:3000/) 以查看应用程序。

**手动配置：**

1. frontend/public/config.js是调用 API 的配置文件，可以根据实际需要进行修改。
2. 默认配置为：window.config = {“askRole”：“user”， “answerRole”：“assistant”， “apiIP”[：“http://localhost:8004”](http://localhost:8004"/)}
3. askRole 和 answerRole 是 API 内容的参数，前端使用它从 API 检索内容，并且必须与 API 返回内容属性的属性匹配。
4. apiIP 是服务地址。

## Docker部署

通过 Docker 部署项目。Docker-Compose 已经配置了前端和服务器相关设置，可以修改这些设置。

1. 配置OPENAI_KEY，打开Docker-Compose.yml文件进行修改和保存。
2. 切换到根目录。
3. 手动修改 API 配置文件 frontend/public/config.js，默认配置为：window.config={“askRole”：“user”，“answerRole”：“assistant”，“apiIP”：“[http://localhost:8004”](http://localhost:8004"/)}
4. 将 apiIP 修改为“/api”。
5. 运行 docker-compose up 。
6. 打开 Web 浏览器并导航到 [http://localhost:8006](http://localhost:8006/) 以查看应用程序。
7. 打开 http://localhost:8005/docs 以查看 API 文档。

## 使用
要使用聊天机器人，只需在聊天窗口中输入消息，然后按回车键。聊天机器人将根据用户的输入回复消息。还支持以下函数：

1. 提供多轮对话，并提供关闭选项。
2. 聊天记录永久存储在浏览器中。
3. 将聊天记录下载为图像。

## System screenshot

 桌面视图

#### 主页

   ![home-dv](\/assets\/home-dv.png)

#### 聊天区域

   ![chat-dv](\/assets\/chat-dv.png)                        

### 移动视图                                                      

#### 主页

 ![home-mv](\/assets\/home-mv.png)

#### 边栏

 ![drawer-mv](\/assets\/drawer-mv.png)  

#### 聊天区域

 ![chat-mv](\/assets\/chat-mv.png) 

## 贡献
欢迎投稿！如果您想为这个项目做出贡献，请分叉存储库并提交拉取请求。

## 许可证

该项目在 Apache 许可证 2.0 下获得许可。