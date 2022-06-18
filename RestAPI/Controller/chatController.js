const chatModel = require('../models/chatModel');
const userModel = require('../models/userModel');

const accessChat = async(req,res)=>{

    const {to_chat_user} = req.body;
    const current_user = req.user_id;

    if(!to_chat_user){
        return res.status(400).json({message: 'Cannont find user'});
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

    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName: "sender",
            users: [current_user, to_chat_user],
        };

        try {
            const createdChat = await chatModel.create(chatData);
            const fullChat = await chatModel.findOne({_id:createdChat._id}).populate("users","username name surname");

            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400).json({message:error.message});
        }
    }

}

const fetchChats = async(req,res)=>{
    const current_user = req.user_id;

    try {
        chatModel.find({ users: { $elemMatch: { $eq: current_user } } })
          .populate("users", "username name surname")
          .populate("latestMessage")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            results = await userModel.populate(results, {
              path: "latestMessage.sender",
              select: "username name surname",
            });
            res.status(200).send(results);
          });
      } catch (error) {
        console.log(error.message);
        res.status(400).json({message:error.message});
      }
}

module.exports = {
    accessChat,
    fetchChats
}