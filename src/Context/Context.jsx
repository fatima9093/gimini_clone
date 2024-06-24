import { createContext, useState } from "react";
import run from "../config/gimini";

export const Context= createContext();

const ContextProvider=(props)=>{


    const [input,setInput]=useState("")//input data 
    const [recentPrompt,setRecentPrompt]=useState("")//when send button is clicked it is used to display in main component
    const [prevPrompt,setPrevPrompt]=useState([])//input history and display in recent tag
    const [showResult,setShowResult]=useState(false)//it will hide the card and main component to display the result 
    const [loading,setLoading]=useState(false)//it will show loading animation
    const [resultdata,setResultData]=useState("")//display result on web page

    const delayPara= (index,nextWord)=>{
        setTimeout(function (){
            setResultData(prev=>prev + nextWord)
        },75*index)

    }

    const newChat=()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent= async (prompt) =>{

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !==undefined){
            response= await run(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompt(prev=>[...prev,input])
            setRecentPrompt(input)
            response= await run(input)
        }
        let responseArray=response.split("**")
        let newResponse="";
        for(let i=0;i<responseArray.length;i++){
            if(i==0 || i%2 !== 1){
                newResponse+=responseArray[i]
            }
            else{
                newResponse += "<b>" + responseArray[i]+"</b>"
            }
        }
        let newResponse2=newResponse.split("*").join("</br>")
        let newResponeArray=newResponse2.split(" ")
        for(let i=0;i<newResponeArray.length;i++){
            const nextWord=newResponeArray[i]
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")

    }

// onSent("what is react js")


    const contextValue={
        newChat,
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultdata,
        input,
        setInput

    }


    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider