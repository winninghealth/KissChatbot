import React, { useDebugValue, useEffect, useState } from "react";
import {
  Box,
  Button,
  styled,
  TextField,
  useMediaQuery,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useRef } from "react";
import generateUniqueId from "../../utils/generateUID";
import loader from "../../utils/loader";
import chatStripe from "../../utils/chatStripe";
import "./chatContainer.style.css";
import { useContext } from "react";
import { chatContext } from "../../context/ChatContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircularProgress from "@mui/material/CircularProgress";
import CachedIcon from "@mui/icons-material/Cached";
import StopOutlinedIcon from "@mui/icons-material/StopOutlined";
import { themeContext } from "../../context/ThemeContext";
import typeText from "../../utils/typeText";

import MemoryIcon from "@mui/icons-material/Chat";
import DowloadIcon from "@mui/icons-material/Download"
import DeletIcon from "@mui/icons-material/DeleteOutline";
import { Global } from "@emotion/react";
import toast, { Toaster } from 'react-hot-toast';
import chatStore from "../../utils/storage"
import { toPng } from 'html-to-image';
import hljs from 'highlight.js'
import 'highlight.js/styles/base16/edge-dark.css'
import AlertConfirm from "react-alert-confirm";

const ChatContainer = ({ models, currModel, temp, maxLength }) => {
  const formRef = useRef(null);
  const chat_container_ref = useRef(null);
  const [error, setError] = useState(false);
  const fetchStoped = useRef("");
  const isMobile = useMediaQuery("(max-width:767px)");
  const manualResponses = {
    greeting: [
      "Hi there! How can I help you?",
      "Hello! How can I assist you today?",
      "Hi! Nice to meet you",
    ],
    "who are you": [
      "I am Nobita, a large language model trained by OpenAI. I am here to answer any questions you may have and assist you with any information you may need.",
      "I am Nobita, a large language model developed by OpenAI. I am here to assist you with any questions or information you may need.",
      "I am Nobita created by Hashmat Wani. How can I help you today?",
      "I am Nobita, a large language model trained by OpenAI, designed by Hashmat Wani to answer questions, provide information, and assist with various tasks. Is there something specific you need help with?",
      "Hello! I am an AI language model called Nobita, designed by Hashmat Wani to assist with a variety of tasks, such as answering questions, providing information, and generating text. Is there something specific you would like to know or talk about?",
    ],
    "your name": [
      "I'm Nobita, How can I help you?",
      "My name is Nobita, How can I assist you",
    ],
  };


  const {
    setIsChatOpen,
    clearChat,
    setClearChat,
    inputValue,
    setInputValue,
    initialInputValue,
    setInitialInputValue,
    loading,
    setLoading,
    loadingInterval,
    typing,
    setTyping,
    typingInterval,
    setSnackBarOpenStatus,
    setSnackBarVariant,
    historyChat,
    setHistoryChat,
    storeList,
    setStoreList,
    viewGroupId,
    setViewGroupId,
    memory,
    setMemory,
    lastInputValue,
    setLastInputValue,
    lastUniqueId,
    setLastUniqueId,
    apiConfig, setApiConfig

  } = useContext(chatContext);

  const { theme } = useContext(themeContext);

  let _controller = new AbortController();
  let signal = _controller.signal;
  const onButtonClick = () => {

    var htmlToImage = require('html-to-image');
    var node = document.getElementById('chat_container');
    let imageName = "";
    let cid = document.getElementById("chat_container").getAttribute("cid");
    let chats = chatStore.get("chathistory");
    chats.map(item => {
      if (item.groupid === cid) {
        imageName = item.title.length > 10
          ? item.title.slice(0, 9) + "..."
          : item.title
      }
    })
    htmlToImage
      .toPng(node)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        var a = document.createElement("a");
        a.download = imageName + ".png";
        a.href = dataUrl;
        a.click();

      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });

  }
  const manualReply = (query, loadingDiv) => {
    let replies = manualResponses[query];
    let randomReply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      setError(false);
      clearInterval(loadingInterval.current);
      loadingDiv.innerHTML = "";
      setTyping(true);
      typeText(
        loadingDiv,
        chat_container_ref.current,
        randomReply,
        typingInterval,
        setLoading,
        setTyping
      );
    }, 1200);
  };

  const responses = document.querySelectorAll(".ai");
  document.querySelectorAll(".copy").forEach((el, idx) => {
    el.addEventListener("click", () => {
      fnCopy(responses[idx].innerText);
      setSnackBarOpenStatus(true);
      setSnackBarVariant("copy");
    });
  });

  if (clearChat) {
    chat_container_ref.current.innerHTML = "";
  }
  function fnCopy(copyText) {

    const input = document.createElement('input')
    document.body.appendChild(input);
    input.setAttribute('value', copyText);
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy');
    }
    document.body.removeChild(input);
  }


  function checkGreeting(value) {
    return [
      "hi",
      "hello",
      "hey",
      "hey nobita",
      "how are you",
      "greeting",
      "how do you do",
    ].includes(value.toLowerCase());
  }

  function getModeApiUrl(modelId) {
    let model = models.filter(function (item) {
      if (item.id === modelId) {
        return item;
      }
    }
    )
    if (model.length > 0) {
      return model[0].apiUrl;
    }
    else {
      return "";
    }
  }
  function encodeHTML(source) {
    return source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
  function lightConten(codes) {
    hljs.configure({
      ignoreUnescapedHTML: true,
      noHighlightRe: /^do-not-highlightme$/i,
      languageDetectRe: /\bgrammar-([\w-]+)\b/i,
      classPrefix: 'hljs-',
      language: ["xml", "python", "javascript", "html", "cssharp", "java", "C++", "C"]
    })
    hljs.highlightElement(codes);
  }
  function turnMemory(e) {

    if (e.currentTarget.attributes.ctype.nodeValue === "off") {

      setMemory(true);
      toast.success('Multi-turn conversation has been enabled!\n\nThe model only remembers the last 5 rounds of conversation！', {
        duration: 2500,
        position: "top-center",
        className: "toaster",
        style: {
          background: 'rgb(107, 60, 220)',
          color: '#ffffff',
        }
      });
    }
    else {

      setMemory(false);
      toast.error('Multi-turn conversation closed!', {
        duration: 1000,
        className: "toaster",
        position: "top-center"

      });
    }
  }

  function addChatStore(data) {

    let parsedData = data.message;
    if (memory) {
      setHistoryChat(data.history);
    }
    //  Store conversation information.
    let chats = chatStore.get("chathistory");
    let currentId = document.getElementById("chat_container").getAttribute("cid");
    if (currentId === undefined || currentId === null) {
      currentId = document.querySelectorAll(".newChat")[0].id;
    }
    let currentChat = {
      "groupid": currentId,
      "title": data.query, "memory": memory, "model": currModel,
      "chatconten": [
        { "uuid": data.uuid, "usermsg": data.query, "aimsg": parsedData }
      ]
    };

    let isExsit = storeList.filter(item => {
      if (item.groupid === currentId) {
        return true;
      }
    });
    if (isExsit.length > 0) {
      chats.map(item => {
        if (item.groupid === currentId) {
          item.memory = memory;
          item.model = currModel;
          let index_c = item.chatconten.findIndex(ctem => ctem.uuid === data.uuid);
          if (index_c > -1) {
            item.chatconten.splice(index_c, 1);
          }


          item.chatconten.push({ "uuid": data.uuid, "usermsg": data.query, "aimsg": parsedData }
          );
        }
      });
    }
    else {
      chats.push(currentChat);
    }
    chatStore.set("chathistory", chats);
    setStoreList(chatStore.get("chathistory"));

  }
  function handleStop(e) {

    if (loading) {
      fetchStoped.current = 1;
      clearInterval(typingInterval.current);
      setTyping(false);
      setLoading(false);
    }

  }

  function scrollAuto() {

    if (document.getElementById('chat_container').clientHeight -window.innerHeight > -190) {
    
      window.scrollTo(0, document.body.scrollHeight);
    }
    else{
      window.scrollTo(0, 0);
    }
  }
  async function handleSubmit(e, lastInput = false, speechRes = false) {

    e && e.preventDefault();
    const data = new FormData(formRef.current);
    let haddleId = "";
    let query = lastInput
      ? lastInput
      : speechRes
        ? speechRes
        : data.get("prompt");
    query = query.trim();

    if (!query) return;

    let apiUrl = getModeApiUrl(currModel);
    let requJson = { user_request: query, history: [] };

    if (memory) {
      requJson.history = historyChat;
    }
    else {
      delete requJson.history;
    }

    setLoading(true);
    setIsChatOpen(true);
    setClearChat(false);

    if (!initialInputValue || checkGreeting(initialInputValue)) {
      let uid = generateUniqueId();
      setViewGroupId(uid);
      document.getElementById("chat_container").setAttribute("cid", uid);
      if (checkGreeting(query)) setInitialInputValue("Greeting");
      else setInitialInputValue(query);
    }
    setLastInputValue(query);
    setInputValue("");

    // user chatStripe

    if (!lastInput) {
      chat_container_ref.current.innerHTML += chatStripe(false, query);
    }

    formRef.current.reset();

    // AI chatStripe
    let uniqueId;
    if (!lastInput) {
      uniqueId = generateUniqueId();
      setLastUniqueId(uniqueId);
    }
    if (!lastInput) {
      chat_container_ref.current.innerHTML += chatStripe(true, " ", uniqueId);
    }

    const loadingDiv = document.getElementById(
      lastInput ? lastUniqueId : uniqueId
    );

    haddleId = lastInput ? lastUniqueId : uniqueId;
    if (lastInput)
      loadingDiv.style.color = theme === "light" ? "#383838" : "#dcdcdc";

    loader(loadingDiv, loadingInterval);

    if (["hi", "hello", "hey", "hey nobita"].includes(query.toLowerCase())) {
      manualReply("greeting", loadingDiv);
      return;
    }

    if (
      [
        "who are you",
        "whi are you",
        "who r u?",
        "who r u",
        "who are you?",
      ].includes(query.toLowerCase())
    ) {
      manualReply("who are you", loadingDiv);
      return;
    }

    if (
      [
        "what's your name?",
        "what's your name",
        "what is your name?",
        "what is your name",
        "what is ur name",
        "your name?",
        "your name",
        "ur name?",
        "ur name",
      ].includes(query.toLowerCase())
    ) {
      manualReply("your name", loadingDiv);
      return;
    }

    scrollAuto();
    if (models.length === 0) {
      setError(true);
      setLoading(false);
      setTyping(false);
      loadingDiv.innerHTML = "Model is empty, please configure the model!";
      loadingDiv.style.color = "#EF4444";

      clearInterval(loadingInterval.current);
      fetchStoped.current = 0;

      return;
    }
    let i = 0;
    let lastTextIndex = 0;
    let codeNum = 0;
    let chatData = {};
    let isStream = false;

    let response = await fetch(apiUrl, {
      method: 'POST',
      signal: signal,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requJson)
    })
      .then(response => {
        if (response.headers.get('Content-Type') === "application/json") {
          isStream = false;
        }
        else {
          isStream = true;
        }
        const reader = response.body.getReader();
        let receivedLength = 0;
        let chunks = [];
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {

                //中止请求
                if (fetchStoped.current === 1) {

                  _controller.abort();
                  controller.close();
                  fetchStoped.current = 0;
                  setLoading(false);
                  setTyping(false);
                  return;
                }

                if (done) {
                  controller.close();
                  return;
                }
                receivedLength += value.length;
                chunks.push(value);
                const text = new TextDecoder('utf-8').decode(value);
                controller.enqueue(text);
                push();
              }).catch(error => {
                console.error(error);
                controller.error(error);
              });
            }
            push();
          }
        });
      })
      .then(stream => {
        const reader = stream.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                push();
              }).catch(error => {
                console.error(error);
                controller.error(error);
              });
            }
            push();
          }
        });
      })
      .then(stream => {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        return new Promise((resolve, reject) => {
          function process() {
            reader.read().then(({ done, value }) => {

              if (done) {   
                resolve();
                //Process relevant conversation status.
                fetchStoped.current = 0;
                if (isStream === true) {
                  setLoading(false);
                  setTyping(false);
                }

                //Store conversation information.
                chatData.query = query;
                chatData.uuid = haddleId;
                addChatStore(chatData);
                return;
              }

              let res = value;
              let data = {};
              i += 1;
              const lastIndex = value.lastIndexOf('\n', value.length - 2);
              if (lastIndex !== -1) {
                res = value.substring(lastIndex);
              }

              try {
                data = JSON.parse(res);
                chatData = JSON.parse(res);
              }
              catch (e) {
                debugger;
                console.log(e.message)
                data={message:""};
              }

               
              if (lastTextIndex == 0) {
                clearInterval(loadingInterval.current);
                loadingDiv.innerHTML = "";
                setError(false);
                setTyping(true);
              }
              if (data.message == undefined || data.message == null) {
                setError(true);
                setLoading(false);
                setTyping(false);
                loadingDiv.innerHTML = "Sorry, server is down rightnow, try again later";
                loadingDiv.style.color = "#EF4444";

                clearInterval(loadingInterval.current);
                fetchStoped.current = 0;
                return;
              }

              let ctext = data.message.substring(lastTextIndex);
              let codeobj = null;
            
              //Determine if it is a stream output.
              if (isStream === true) {
                if (data.message.lastIndexOf("``") > -1) {
                  if (ctext.lastIndexOf("``") > -1) {
                    if (codeNum % 2 === 0) {
                      codeobj = document.createElement("div");
                      codeobj.className = "code";
                      loadingDiv.append(codeobj);
                    }
                    else {
                      const codes = loadingDiv.getElementsByClassName("code");
                      codeobj = codes[codes.length - 1];
                      codeobj.innerHTML += "";
                    }
                    codeNum += 1;
                  }
                  else {
                    if (codeNum % 2 === 1) {
                      
                      const codes = loadingDiv.getElementsByClassName("code");
                      codeobj = codes[codes.length - 1];
                      codeobj.innerHTML += encodeHTML(ctext);
                      lightConten(codeobj);
                    }
                    else {
                      if(ctext.replaceAll("\n","")==="`")
                      {
                        ctext="";
                      }
                      loadingDiv.innerHTML += ctext;
                    }
                  }
                } else {
                  loadingDiv.innerHTML += ctext;
                }
                if(data.message!=0)
                {
                  lastTextIndex = data.message.length;
                }
               
              }
              else { 
                typeText(
                  loadingDiv,
                  chat_container_ref.current,
                  ctext,
                  typingInterval,
                  setLoading,
                  setTyping
                );

              }


              scrollAuto();
              process();

            }).catch(error => {

              console.error(error);
              reject(error);
            });
          }
          process();
        });
      })
      .catch(error => {
        setError(true);
        setLoading(false);
        setTyping(false);
        loadingDiv.innerHTML = "Sorry, server is down rightnow, try again later";
        loadingDiv.style.color = "#EF4444";

        clearInterval(loadingInterval.current);
        fetchStoped.current = 0;
      }
      );


  }

  function deleteChatMsg(e) {

    let cid = document.getElementById("chat_container").getAttribute("cid");
    if (viewGroupId === "" && (cid === "" || cid === null)) {
      return;
    }
    AlertConfirm.closeAll();
    let groupid = e.currentTarget.getAttribute("groupid");
    if (groupid === "") {
      groupid = cid;
    }

    AlertConfirm({
      zIndex: 1024,
      title: 'Are you sure you want to delete?',
      okText: 'Yes',
      cancelText: 'No',
      maskClosable: true,
      onOk: () => {
        e.preventDefault();

        let chats = chatStore.get("chathistory");
        let index = chats.findIndex(item => item.groupid === groupid);
        chats.splice(index, 1);
        chatStore.set("chathistory", chats);
        setStoreList(chatStore.get("chathistory"));
        
        setClearChat(true);
        setIsChatOpen(false);
        setInitialInputValue("");
        setLoading(false);
        setTyping(false);
        clearInterval(typingInterval.current);
        clearInterval(loadingInterval.current);
        setHistoryChat([]);
        setMemory(true);
        setViewGroupId("");
        document.getElementById("chat_container").removeAttribute("cid");

      }

    });

    e.stopPropagation();
  }

  return (
    <div>
      <Container
        typing={typing}
        load={loading}
        error={error}
        ref={chat_container_ref}
        id="chat_container"
        sx={{ backgroundColor: "background.primary" }}
      ></Container>

      {/* Footer */}
      <Box
        display="flex"
        flexDirection="column"
        // rowGap={1}
        position="fixed"
        bottom={0}
        sx={{
          left: { xs: 0, md: "268px" },
          width: { xs: "100%", md: "calc(100% - 268px)" },
          borderColor: "background.accent",
        }}
      >
        {initialInputValue && (
          <Box
            margin="0 auto"
            sx={{
              cursor: "pointer",
              backgroundColor: "background.primary",
            }}
          >
            {typing ? (
              <FloatingBtn
                onClick={(e) => handleStop(e)}
              >
                <StopOutlinedIcon fontSize="small" />
                Stop generating
              </FloatingBtn>
            ) : !loading ? (
              <FloatingBtn onClick={(e) => handleSubmit(e, lastInputValue)}>
                <CachedIcon fontSize="small" />
                Regenerate response
              </FloatingBtn>
            ) : null}
          </Box>
        )}
        <Box
          className="footer"
          display="flex"
          flexDirection="row"
          rowGap={2}

          sx={{
            p: { xs: "10px 11px 15px 7px", md: "7px 4% 12px" },
            backgroundColor: "background.primary",
            borderColor: "background.accent",

          }}
        >
          {!isMobile &&
            (<Box display="flex" sx={{
              width: initialInputValue ? "80px" : "50px"

            }}>
              <Button onClick={onButtonClick} sx={{
                minWidth: "auto",
                padding: "6px 6px",
                color: "text.primary",
              }}>
                <DowloadIcon sx={{ display: initialInputValue ? "block" : "none", marginTop: "7px" }} />
              </Button>
              <Button onClick={(e) => turnMemory(e)} ctype={memory === true ? "on" : "off"} id="btn_Memory"
                sx={{
                  minWidth: "auto",
                  padding: "6px 6px",
                  color: memory === true ? "#1976d2" : "text.primary"
                }}
              >

                <MemoryIcon sx={{ marginTop: "7px" }} />
              </Button>

            </Box>
            )
          }

          {isMobile &&
            (
              <Box display="flex" id="btn_clearChat" groupid={viewGroupId} onClick={(e) => deleteChatMsg(e)} sx={{ width: { xs: "30px", md: "30px", marginTop: "7px" } }}>
                <DeletIcon sx={{ marginTop: "7px", cursor: "pointer" }} />
              </Box>

            )
          }

          <Box backgroundColor="background.accent" borderRadius="8px"

            sx={{
              width: { xs: isMobile ? "calc(100% - 30px)" : "calc(100% - 60px)", md: isMobile ? "calc(100% - 30px)" : "calc(100% - 60px)" }
            }}
          >
            <Box className="toaster" sx={{ top: "150px" }}>
              <Toaster />
            </Box>

            <form ref={formRef} onSubmit={handleSubmit}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p="0 10px 0 20px"
              >
                <TextField
                  // border={1}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(ev) => {

                    if (ev.key === 'Enter' && ev.shiftKey === false && ev.target.value !== "") {
                      handleSubmit(ev, false);
                      ev.preventDefault();
                    }
                  }}
                  autoFocus
                  name="prompt"
                  fullWidth
                  value={inputValue}
                  variant="standard"
                  placeholder=""
                  multiline
                  maxRows={4}
                  sx={{
                    p: "10px 0",
                    overflow: "hidden",
                    // border: "1px solid red",
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                />

                <Button
                  disabled={inputValue.trim().length === 0 || loading}
                  sx={{
                    color: "text.primary",
                    borderRadius: "5px",
                    "&:hover": {
                      backgroundColor: "background.primary",
                    },
                  }}
                  type="submit"
                >
                  {loading ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: "text.primary" }}
                    />
                  ) : (
                    <SendIcon />
                  )}
                </Button>
              </Box>
            </form>
          </Box>

        </Box>
        <Box sx={{ paddingBottom: { xs: "10px", md: "10px" }, color: "text.primary", backgroundColor: "background.primary" }}>
          <Typography fontSize="12px" textAlign="center" backgroundColor="background.primary">
           Made with<FavoriteIcon fontSize="inherit" />{" "}
            and Open AI by Hashmat Wain
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default ChatContainer;

const Container = styled("div")(({ theme, typing, load, error }) => ({
  color: theme.palette.text.primary,
  ".ai": {
    backgroundColor: theme.palette.background.accent,
    color: `${theme.palette.text.primary} !important`,
  },
  ".copy": {
    display: `${typing || load || error ? "none" : "block"}`,
    cursor: "pointer",
    "& img": { width: "22px" },
  },
}));

const FloatingBtn = styled(Box)(({ theme }) => ({
  padding: "8px 12px",
  border: `1px solid ${theme.palette.background.dark}`,
  ":hover": { backgroundColor: theme.palette.background.accent },
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  columnGap: "5px",
  borderRadius: "5px",
}));
