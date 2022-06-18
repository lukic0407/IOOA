const mongoose = require ('mongoose')

const chatSchema = new mongoose.Schema({
    chatName:{
        type:String,
        required:true
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
    }],
    latestMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"message"
    }
    },
    {
        timestamps:true,
    });

module.exports = mongoose.model('chat', chatSchema) 
//Exportanje scheme za koristenje u drugim fileovima