import hljs from 'highlight.js'
// import 'highlight.js/styles/base16/dracula.css'
// import 'highlight.js/styles/base16/edge-light.css'
import 'highlight.js/styles/base16/edge-dark.css'
// import 'highlight.js/styles/github.css'
// import 'highlight.js/styles/vs2015.css'

var c=0;
var  codeArry=[];
var _chatContainer;
var _el;
function lightConten(codes)
{
    // 配置 highlight.js
    hljs.configure({
      // 忽略未经转义的 HTML 字符
      ignoreUnescapedHTML: true,
      language:["xml","python","javascript","html","C#","java","C++","C"]
    })
    hljs.highlightElement(codes);
}

function haddText()
{
    if(c>=codeArry.length){
      return false;
    }
     
   if(c%2==0)
   {
    writeContent(_el,codeArry[c]);
    setTimeout(haddText,codeArry[c].length*20);
   }
   else{
     let codeobj=document.createElement("div");
     codeobj.className="code";
     _el.append(codeobj);
     codeobj.innerHTML=codeArry[c];
     lightConten(codeobj);
     setTimeout(haddText,20);
   }
   
   c++;
   
}

function scrollAuto() {
 
  if (document.getElementById('chat_container').clientHeight - window.innerHeight > -190) {
    // document.body.scrollIntoView({ behaviour: "smooth" });
    window.scrollTo(0, document.body.scrollHeight);
  }
  else{
    window.scrollTo(0, 0);
  }
}
function writeContent(container,text)
    {
      let idx = 0;
       var blockContent=setInterval(() => {
        if (idx < text.length) {
          container.append(text[idx++]);
          scrollAuto();
        }
        else{
          clearInterval(blockContent);
        }
      }, 15);


    }

function typeText(
  el,
  chatContainer,
  text,
  typingInterval,
  setLoading,
  setTyping
) {

  c=0;
   codeArry=text.split("```");
   _chatContainer=chatContainer;
   _el=el;
    
   haddText();
   setLoading(false);
   setTyping(false);
}   

export default typeText;
