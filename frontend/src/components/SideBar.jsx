import React, { useContext, useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Drawer from "@mui/material/Drawer";
import {
  Box,
  Divider,
  FormHelperText,
  NativeSelect,
  styled,
  Typography,
  useMediaQuery,
  Button,
  Input,
  TextField
} from "@mui/material";
import { themeContext } from "../context/ThemeContext";
import { chatContext } from "../context/ChatContext";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import RotateLeftSharpIcon from "@mui/icons-material/RotateLeftSharp";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import Slider from "@mui/material/Slider";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeletIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import MemoryIcon from "@mui/icons-material/Chat";
import DowloadIcon from "@mui/icons-material/Download"

import chatStore from "../utils/storage"      
import chatStripe from "../utils/chatStripe";
import hljs from 'highlight.js'
import 'highlight.js/styles/base16/edge-dark.css'
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
import { getDesignTokens } from "../theme";
import { toPng } from 'html-to-image';
import toast, { Toaster } from 'react-hot-toast';

const SideBar = ({
  models,
  currModel,
  setCurrModel,
  temp,
  setTemp,
  maxLength,
  setMaxLength,
}) => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [state, setState] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const {theme, toggleTheme } = useContext(themeContext);
  
  const {
    setIsChatOpen,
    setClearChat,
    initialInputValue,
    setInitialInputValue,
    setLoading,
    setTyping,
    typingInterval,
    loadingInterval,
    isChatOpen,
    setHistoryChat,
    historyChat,
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
    apiConfig, 
    setApiConfig
    
  } = useContext(chatContext);
  useEffect(() => {
    setStoreList(chatStore.get("chathistory"));
     
  }, []);
  
  const newChat = () => {
    window.scrollTo({top:0});
    document.getElementById("chat_container").setAttribute("cid","");
    setState(!state)
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
     
  };
  
  function lightConten(codes)
  {
    
      hljs.configure({
        ignoreUnescapedHTML: true,
        noHighlightRe: /^do-not-highlightme$/i,
        languageDetectRe: /\bgrammar-([\w-]+)\b/i,
        language: ["xml", "python", "javascript", "html", "cssharp", "java", "C++", "C"]
      })
      hljs.highlightElement(codes);
  }

  
  function getTitle(groupid)
  {
 
    let chatTitle="";
    let chats=chatStore.get("chathistory");
    chats.map(item=>{
      if(item.groupid===groupid)
      {
        chatTitle=item.title;
      }
    })
    chatTitle= chatTitle.length > 8
             ? chatTitle.slice(0, 8) + "..."
             : chatTitle;
    return chatTitle;
  }
 
  function viewChatMsg(groupid,title)
  {
   
    setState(!state);
 
    setClearChat(true);
    setIsChatOpen(false);
    setLoading(false);
    setTyping(false);
    clearInterval(typingInterval.current);
    clearInterval(loadingInterval.current);
    setHistoryChat([]);
    setMemory(false);

    setIsChatOpen(true);
    setClearChat(false);
 
    setInitialInputValue(title);
    document.querySelectorAll(".newChat").forEach(function(item){
      setInitialInputValue(item.textContent);
      });
    
   window.scrollTo({
        top:0
   })
   
    let h=[];
    let chats=chatStore.get("chathistory");
    let chat_container_ref=document.getElementById("chat_container");
    chat_container_ref.innerHTML="";
    chat_container_ref.setAttribute("cid",groupid);
    
     
    chats.map(item=>{
    if(item.groupid===groupid)
    {
      clearInterval(loadingInterval.current);
      setTyping(true);

     item.chatconten.map(chat=>{
       // user chatStripe
       chat_container_ref.innerHTML += chatStripe(false, chat.usermsg);
       // bot's chatStripe
       let codeArry=chat.aimsg.split("```");
       let answerHtml="";
       for(var c=0;c<codeArry.length;c++)
       {
        if(c%2==0)
        {
          answerHtml+=codeArry[c];
        }
        else{
          let codeobj=document.createElement("div");
              codeobj.className="code";
              codeobj.innerHTML=codeArry[c];
              lightConten(codeobj);
              answerHtml+=codeobj.outerHTML;
        }
       }
       
       chat_container_ref.innerHTML += chatStripe(true, answerHtml, chat.uuid);
      if(apiConfig===null)
      {
        h.push([chat.usermsg,chat.aimsg]);
      }
      else{
        h.push({'role':apiConfig.askRole, 'content':chat.usermsg});
        h.push({'role':apiConfig.answerRole, 'content':chat.aimsg});
      }

     });
    
    setCurrModel(item.model);
    localStorage.setItem("lastMode",item.model);
    setMemory(item.memory);
   
    setHistoryChat(h);
 
    setLastUniqueId(item.chatconten[item.chatconten.length-1].uuid);
    setLastInputValue(item.chatconten[item.chatconten.length-1].usermsg);
    clearInterval(typingInterval.current);
    setTyping(false);
    setLoading(false);

    }
    
    });
    
  
  }
  function deleteChatMsg(e)
  {
    setState(!state);
    AlertConfirm.closeAll();
    let groupid=e.currentTarget.getAttribute("groupid");
    AlertConfirm({
      zIndex: 1024,
      title: 'Are you sure you want to delete?',
      okText: 'Yes',
      cancelText: 'No',
      maskClosable:true,
      onOk: () => {
           e.preventDefault();
    
    let chats=chatStore.get("chathistory");
    let index=chats.findIndex(item => item.groupid ===groupid);
    chats.splice(index, 1);
    chatStore.set("chathistory",chats);
    setStoreList(chatStore.get("chathistory"));
     
    if(isChatOpen)
    {
      newChat();
      if(chats.length>0)
      {
       viewChatMsg(chats[chats.length-1].groupid,chats[chats.length-1].title);
      }
    }
  }
       
    });
    
    e.stopPropagation();
  }
  function editChatTitle(e)
  {
    
    let t=e.currentTarget.getAttribute("title");
    setInputValue(t);
    e.currentTarget.parentElement.getElementsByClassName("MuiTextField-root")[0].style.display="block";
    e.currentTarget.parentElement.querySelectorAll("font").forEach(function(item){item.style.display="none"});
    e.currentTarget.parentElement.querySelectorAll("svg").forEach(function(item){item.style.display="none"});
    e.currentTarget.parentElement.childNodes[4].textContent='';
    e.currentTarget.parentElement.childNodes[2].style.display="block";
    e.stopPropagation();
  }
  function saveTitle(e)
  {
    let t= e.currentTarget.parentElement.getElementsByTagName("input")[0].value;
    let currenGroupId=e.currentTarget.getAttribute("groupid");
    e.currentTarget.parentElement.getElementsByClassName("MuiTextField-root")[0].style.display="none";
    e.currentTarget.parentElement.querySelectorAll("svg").forEach(function(item){item.style.display="block"});
    e.currentTarget.parentElement.querySelectorAll("font").forEach(function(item){item.style.display="block"});
    e.currentTarget.parentElement.childNodes[4].textContent=t.length > 8
    ? t.slice(0, 8) + "..."
    : t
    e.currentTarget.parentElement.childNodes[2].style.display="none";
    
    let chats=chatStore.get("chathistory");

 chats.map(function(item){
  if(item.groupid==currenGroupId)
  {
   item.title=t;
  }
 });
    chatStore.set("chathistory",chats);
    setInputValue("");
    e.stopPropagation();
  }
  const onButtonClick = () => {

    var htmlToImage = require('html-to-image');
    var node = document.getElementById('chat_container');
    let imageName = "";
    let cid = document.getElementById("chat_container").getAttribute("cid");
    let chats = chatStore.get("chathistory");
    chats.map(item => {
      if (item.groupid === cid) {
        imageName = item.title.length > 8
          ? item.title.slice(0, 8) + "..."
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
  return (
   
    <Box>
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            columnGap: "16px",
            color: "text.primary",
            backgroundColor: "background.accent",
            position: "fixed",
            borderBottom: 1,
            borderColor: "text.primary",
            top: 0,
            left: 0,
            p: "8px 16px",
            zIndex: 100,
            width: "100%",
          }}
        >
          <MenuIcon cursor="pointer" sx={{flex:"0.1",}} onClick={() => setState(!state)} />
         
          <Box sx={{flex:"0.7",textAlign:"center"}}>
            {!initialInputValue?"New chat":getTitle(document.getElementById("chat_container").getAttribute("cid"))}
           
             </Box>
             <MemoryIcon cursor="pointer"  sx={{flex:"0.1", color: memory === true ? "#1976d2" : "text.primary"}} 
             onClick={(e) => turnMemory(e)} ctype={memory === true ? "on" : "off"} id="btn_Memory" />
             <DowloadIcon cursor="pointer" onClick={onButtonClick}   sx={{flex:"0.1", display: initialInputValue ? "block" : "none"}} />
        </Box>
      )}

      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "background.dark",
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))",
            color: "text.primary",
            width: "268px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={state}
        onClose={() => setState(!state)}
      >
        <ScrollBarBox
          sx={{
            "&::-webkit-scrollbar": {
              display: { xs: "none", md: "block" },
              width: "8px",
            },
          }}
        >
        
          {/* New chat */}
          <List 
            onClick={newChat}
            sx={{
              border: 1,
              borderColor: "background.accent",
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "background.accent",
              },
            }}
          >
            <AddIcon fontSize="small" /> New chat
          </List>
          <Box sx={{
               flexDirection:"column",
               display:"flex",
               gap:"0.5rem"

            }}>

{initialInputValue && viewGroupId!="" &&  (
       
      <List className="newChat"  id={viewGroupId}  onClick={(e)=>viewChatMsg(viewGroupId,initialInputValue)} 
         sx={{
           "&:hover": {
             cursor: "pointer",

           },
           border: 1,
           borderColor: "background.accent"
         }}
         variant="text"
         backgroundColor={viewGroupId==document.getElementById("chat_container").getAttribute("cid")? "background.accent":"background.dark"}
       >
         <EditIcon  groupid={viewGroupId} title={initialInputValue} onClick={(e) => editChatTitle(e)} sx={{width:"0.6em",height:"0.6em",right:"3.3rem",position:"absolute" ,cursor:"pointer"}} />
         <DeletIcon groupid={viewGroupId} onClick={(e) => deleteChatMsg(e)} sx={{width:"0.6em",height:"0.6em",right:"2rem",position:"absolute" ,cursor:"pointer"}} /> 
         <SaveIcon groupid={viewGroupId} onClick={(e)=>saveTitle(e)} sx={{width:"0.6em",height:"0.6em",right:"2rem",position:"absolute" ,cursor:"pointer",display:"none"}} /> 
            
         <ChatBubbleOutlineOutlinedIcon sx={{width:"0.6em",height:"0.6em"}} />
         {
          
          initialInputValue.length > 8
           ? initialInputValue.slice(0, 8) + "..."
           : initialInputValue
           
           }
          <TextField
              onChange={(e) => setInputValue(e.target.value)}
              onClick={function(e){e.stopPropagation();}}
              autoFocus
              value={inputValue}
              variant="standard"
              placeholder=""
              sx={{
                display:"none",
                fontSize:"14px",
                width:"86%"
                

              }}

            />
       </List>
       
         
     )}
      
  { storeList.map((ascitem,index) => {
          let item=storeList[storeList.length-index-1];
           let cid=document.getElementById("chat_container").getAttribute("cid");
           if(item.groupid!=viewGroupId)
           {

            return(
              <List className="historyChat" key={item.groupid} id={item.groupid}  
              onClick={ function(e){
                viewChatMsg(item.groupid,item.title);
              }  }
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
                border: 1,
                borderColor: "background.accent",
                backgroundColor:item.groupid==cid?"background.accent":"background.dark",
              }}
              variant="text"
            
            >
            <EditIcon  groupid={item.groupid} title={item.title} onClick={(e) => editChatTitle(e)} sx={{width:"0.6em",height:"0.6em",right:"3.3rem",position:"absolute" ,cursor:"pointer"}} />
            <DeletIcon groupid={item.groupid} onClick={(e) => deleteChatMsg(e)} sx={{width:"0.6em",height:"0.6em",right:"2rem",position:"absolute" ,cursor:"pointer"}} /> 
            <SaveIcon groupid={item.groupid} onClick={(e)=>saveTitle(e)} sx={{width:"0.6em",height:"0.6em",right:"2rem",position:"absolute" ,cursor:"pointer",display:"none"}} /> 
            
              <ChatBubbleOutlineOutlinedIcon sx={{width:"0.6em",height:"0.6em"}} />
               {item.title.length > 8
             ? item.title.slice(0, 8) + "..."
             : item.title}
             <TextField
              onChange={(e) => setInputValue(e.target.value)}
              onClick={function(e){e.stopPropagation();}}
              autoFocus
              value={inputValue}
              variant="standard"
              placeholder=""
              sx={{
                display:"none",
                fontSize:"14px",
                width:"86%"
              }}

            />
            </List>
            
          );
            }
          
        })
         }
          
        </Box>

        </ScrollBarBox>

        <Box
          width="267px"
          padding="10px"
          borderTop={1}
          borderColor="background.primary"
        >
           {/* Native */}
           <FormControl
            sx={{
              width: "236px",
              margin: "5px 10px 10px 10px",
              
            }}
          >
             <Typography>Model</Typography>
            <NativeSelect id="select_mode"
              value={currModel}
              onChange={(e) =>{setCurrModel(e.target.value);localStorage.setItem("lastMode",e.target.value);}}
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.id}
                </option>
              ))}
            </NativeSelect>
            <FormHelperText sx={{ margin: "5px 0 0" }}>
            The model parameters control the engine used to generate responses. 
            </FormHelperText>
          </FormControl>
          
          <Divider />

          <List onClick={() => toggleTheme()}>
            {theme === "light" ? (
              <DarkModeOutlinedIcon fontSize="small" />
              
            ) : (
              <LightModeOutlinedIcon fontSize="small" />
            )}
            {theme === "light" ? "Dark mode" : "Light mode"}
             
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SideBar;

const List = styled(Box)(({ theme }) => ({
  // border: "1px solid blue",
  width: "100%",
  display: "flex",
  columnGap: "15px",
  alignItems: "center",
  padding: "10px 15px",
  borderRadius: "5px",
  "&:hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.background.accent,
  },
}));

const ScrollBarBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: "20px",
  padding: "10px",
  overflowY: "scroll",
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.dark,
  },
  // "&::-webkit-scrollbar": {

  // },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.background.accent,
    borderRadius: "1rem",
    backgroundClip: "content-box",
  },
  "&::-moz-scrollbartrack-vertical": {
    backgroundColor: theme.palette.background.dark,
  },
  "&::-moz-scrollbar": {
    width: "8px",
  },
  "&::-moz-scrollbarbutton-up": {
    backgroundColor: theme.palette.background.accentBar,
  },
}));
