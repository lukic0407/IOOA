const chatModel = require('../models/chatModel');
const userModel = require('../models/userModel');
const messageModel = require('../models/messageModel');

const sendMessage = async(req,res)=>{

    const {chatId,messageContent} = req.body;
    const current_user = req.user_id;

    if(!chatId || !messageContent){
        return res.status(400).json({message: 'Invalid data'});
    }

    var newMessage = {
        sender:current_user,
        content:messageContent,
        chat:chatId
    }

    try {
        var message = await messageModel.create(newMessage);

        message = await message.populate("sender","username");
        message = await message.populate("chat");
        message = await userModel.populate(message,{
            path:'chat.users',
            select:'username',
        });

        await chatModel.findByIdAndUpdate(chatId,{
            latestMessage:message,
        })
        res.json(message);
    } catch (error) {
        res.status(400).json({message:error.message});
    }

   
    

}

const allMessages = async(req,res)=>{
    const {chatId} = req.params;
    console.log(chatId);
    try {
        const messages = await messageModel.find({chat:chatId})
        .populate("sender", "username")
        .populate("chat")

        res.json(messages);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
    
}

const sendMessageFromAccommodation = async(req,res)=>{

    const {to_chat_user,messageContent} = req.body;
    const current_user = req.user_id;

    if(!to_chat_user){
        console.log("here");
        return res.status(400).json({message: 'Cannont find user'});
    }
    if(!current_user || to_chat_user == current_user){
        return res.status(400).json({message: 'Bad user data'});
    }

    var isChat = await chatModel.find({
        $and:[
            {users:{$elemMatch:{$eq:current_user}}},
            {users:{$elemMatch:{$eq:to_chat_user}}}
        ]
    }).populate("users","username name surname").populate("latestMessage");

    isChat = await userModel.populate(isChat,{
        path:'latestMessage.sender',
        select:'username name surname',
    });
    var chatId;
    if(isChat.length>0){
        chatId=isChat[0]._id.toString();;
    }else{
        var chatData = {
            chatName: "sender",
            users: [current_user, to_chat_user],
        };

        try {
            const createdChat = await chatModel.create(chatData);
            const fullChat = await chatModel.findOne({_id:createdChat._id}).populate("users","username name surname");
            chatId=fullChat._id;
        } catch (error) {
            res.status(400).json({message:error.message});
        }
    }

    console.log(chatId);
    if(!chatId || !messageContent){
        return res.status(400).json({message: 'Invalid data'});
    }

    var newMessage = {
        sender:current_user,
        content:messageContent,
        chat:chatId
    }

    try {
        var message = await messageModel.create(newMessage);
        message = await message.populate("sender","username");
        message = await message.populate("chat");
        message = await userModel.populate(message,{
            path:'chat.users',
            select:'username',
        });

        await chatModel.findByIdAndUpdate(chatId,{
            latestMessage:message,
        })
        res.status(200).json({message:'Uspješno poslana'});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
    

}

module.exports = {
    sendMessage,
    allMessages,
    sendMessageFromAccommodation
}