import { ChatState } from "../context/ChatProvider";
import '../css/Chat.css'
import '../css/IconAnimations.css'
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useEffect, useState, useRef } from "react";
import { getSender} from "../CommonFunctions/ChatLogic";
import {SpinLoader, SendMessage} from "../IconPack/Icons";
import ScrollableChat from "./ScrollableChat";
import typingAnimation from '../Animations/typing.json';
import io from 'socket.io-client';
import Animator from "../Animations/Animator";


const ENDPOINT = "http://localhost:3001";
var socket, selectedChatCompare;

const ChatPage = ({fetchAgain}) => {

    const axiosPrivate = useAxiosPrivate();

    const { auth } = useAuth();
    const bottomRef = useRef();
    const {notification, setNotification, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageContent, setmessageContent] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [loop, setLoop] = useState(true)



    const getChatMessages = async () => {

        if(!selectedChat) return
        setLoading(true);
        try {
            const response = await axiosPrivate.get(`/message/${selectedChat}`) //to-replace
            console.log(response.data);
            setMessages(response.data);
            setLoading(false);
            socket.emit('join chat', selectedChat);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchChats = async () => {
        try {
            const response = await axiosPrivate.get('/chat/')
            setChats(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    const typingHandler = (e) =>{
        setmessageContent(e.target.value);
        
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat);
        }

        let lastTypingTime = new Date().getTime();
        var timerLenght = 3000;
        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if(timeDiff >= timerLenght && typing){
                console.log("yes");
                socket.emit('stop typing', selectedChat);
                setTyping(false);
            }
        },timerLenght)
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        socket.emit('stop typing',selectedChat);
        if (messageContent) {
            try {
                const response = await axiosPrivate.post('/message/',
                    JSON.stringify({
                        chatId: selectedChat, //to-replace
                        messageContent:messageContent
                    
                    }),
                    {
                        headers: { 'Content-Type': 'application/json' }
                    })
                console.log(response.data);
                setmessageContent('');
                socket.emit('new message',response.data);
                setMessages([...messages,response.data]);
                console.log(messages);
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup",auth.user_id);
        socket.on("connected",()=>setSocketConnected(true));
        socket.on('typing', ()=>setIsTyping(true))
        socket.on('stop typing', ()=>setIsTyping(false))
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchAgain]);

    useEffect(() => {
        getChatMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    console.log(notification);

    useEffect(() => {
        socket.on('message received',(newMessageReceived)=>{
            if (!selectedChatCompare || selectedChatCompare !== newMessageReceived.chat._id){
                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived,...notification]);
                }
            }else{
                setMessages([...messages,newMessageReceived]);
            }
        });
    });

    useEffect(() => {
        if(bottomRef.current){
        bottomRef.current.scrollTop = bottomRef.current?.scrollHeight;
        }
      }, [messages,isTyping]);

    return (
        <div>
            <div className="chat-window-wrap">
                <div className="chat-contacts">
                    <ul className="menu-list">
                    {chats?.length
                    ? chats.map(chat =>(
                        <li key={chat._id} onClick={(e)=>{setSelectedChat(chat._id);}} className="list-item">{getSender(auth.user_id, chat.users)}</li>
                        ))
                    :<></>
                    }
                    </ul>
                </div>
                <div className="chat-window">
                    { loading ?<SpinLoader color='#4DB7FE'></SpinLoader>
                    : selectedChat ?
                    <>
                    <div ref={bottomRef} className="messages">
                        <ScrollableChat messages={messages}></ScrollableChat>
                        <div ref={bottomRef} />
                        {isTyping?<div style={{ float:'left' ,height: 100, width: 100 }}><Animator loop={loop} animation={typingAnimation}></Animator></div>:<></>}
                    </div>
                    <form name='send-message' onSubmit={sendMessage} className="message-input">    
                        <div className="input full column no-bottom-margin">                                                                                              
                        <span style={{display:'flex'}}><input className="no-bottom-margin" placeholder="Poruka..." type="text" value={messageContent} onChange={e=>typingHandler(e)}></input><span style={{display:'flex',alignItems:'center'}} onClick={sendMessage}><SendMessage color='#4DB7FE'></SendMessage></span></span>
                        </div>
                    </form>
                    </>
                    :<p className="chat-tooltip">Odaberite razgovor za prikaz poruka...</p>
                }
                    
                </div>
            </div>
        </div>
    )

}

export default ChatPage;


