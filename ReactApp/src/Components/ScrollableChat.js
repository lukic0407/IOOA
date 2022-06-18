import useAuth from "../hooks/useAuth";
   
const ScrollableChat = ({messages}) =>{
    const { auth } = useAuth();
    return(<>
        {messages?.length &&
        messages.map((message, index)=>(
            <div key={index} className='message' style={{textAlign:`${message.sender._id === auth.user_id ? "-webkit-right":"left" }`}}>
            <div className={message.sender._id === auth.user_id ? ' other-user-message': ' my-message'}>
                <span >
                    <p>{message.content}
                    </p>
                </span>
            </div>
            </div>
        ))
        }
        </>
    )
}

export default ScrollableChat;