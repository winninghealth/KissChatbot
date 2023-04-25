import React, { createContext, useRef, useState } from "react";

export const chatContext = createContext();

const ChatContext = ({ children }) => {
  const [clearChat, setClearChat] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [initialInputValue, setInitialInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [speechError, setSpeechError] = useState(false);
  const [snackBarOpenStatus, setSnackBarOpenStatus] = useState(false);
  const [snackBarVariant, setSnackBarVariant] = useState("error");
  const loadingInterval = useRef(null);
  const typingInterval = useRef(null);
  const [historyChat, setHistoryChat] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [viewGroupId, setViewGroupId] = useState("");
  const [memory, setMemory] = useState(true);
  const [lastInputValue, setLastInputValue] = useState("");
  const [lastUniqueId, setLastUniqueId] = useState("");
  const [apiConfig, setApiConfig] = useState(null);
 
  return (
    <chatContext.Provider
      value={{
        clearChat,
        setClearChat,
        isChatOpen,
        setIsChatOpen,
        inputValue,
        setInputValue,
        initialInputValue,
        setInitialInputValue,
        loading,
        setLoading,
        typing,
        setTyping,
        loadingInterval,
        typingInterval,
        speechError,
        setSpeechError,
        snackBarOpenStatus,
        setSnackBarOpenStatus,
        snackBarVariant,
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

      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export default ChatContext;
