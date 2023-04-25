import SideBar from "./components/SideBar";
import { Box, styled } from "@mui/material";
import Home from "./components/home/Home";
import { useContext, useState } from "react";
import { chatContext } from "./context/ChatContext";

import { useEffect } from "react";
import axios from "axios";
import ChatContainer from "./components/chatContainer/ChatContainer";
import SnackBar from "./components/SnackBar";
import chatStore from "../src/utils/storage"    

function App() {
  const [models, setModels] = useState([]);
  const [currModel, setCurrModel] = useState("");
  const [temp, setTemp] = useState(0);
  const [maxLength, setMaxLength] = useState(2500);
  const { isChatOpen ,apiConfig, setApiConfig} = useContext(chatContext);

  useEffect(() => {
    let  modelList=[];
    axios.get(window.config.apiIP+`/list_user_endpoints`)
    .then((res) => {
       res.data.map(function(item){
        modelList.push({id: item, apiUrl:window.config.apiIP+item});
       });
      
       setModels(modelList);
      let lastMode=localStorage.getItem("lastMode");
      if(lastMode!=undefined && lastMode!=null)
      {
        setCurrModel(lastMode);
      }
     else{
        if(modelList.length>0)
        {
        setCurrModel(modelList[0].id);
        localStorage.setItem("lastMode",modelList[0].id);
        }
      }
    })
    .catch((err) => console.log(err));

    if(window.config===null || window.config===undefined)
    {
      setApiConfig(null);
    }
    else{
      setApiConfig(window.config);
    }
  }, []);

  return (
    <AppWrapper>
      <SnackBar />
      <SideBar
        models={models}
        currModel={currModel}
        setCurrModel={setCurrModel}
        temp={temp}
        setTemp={setTemp}
        maxLength={maxLength}
        setMaxLength={setMaxLength}
      />
      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        // width="100%"
        // border={2}
        color="text.primary"
        backgroundColor="background.primary"
        sx={{ marginLeft: { xs: 0, md: "268px" },
        top:{ xs:"40px", md:0},
        width: { xs: "100%", md: "calc(100% - 268px)" },
      
      }}
      >
        {!isChatOpen && <Home />}
        <ChatContainer
          models={models}
          currModel={currModel}
          temp={temp}
          maxLength={maxLength}
        />
      </Box>
    </AppWrapper>
  );

  
}


export default App;

const AppWrapper = styled("div")({
  display: "flex",
  fontSize: "14px",
});
