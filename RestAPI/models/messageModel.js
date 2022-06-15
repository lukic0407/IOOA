const mongoose = require ('mongoose')

const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    content:[{
        type: String,
        trim:true,
    }],
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"chat"
    }
    },
    {
        timestamps:true,
    });

module.exports = mongoose.model('message', messageSchema) 
//Exportanje scheme za koristenje u drugim fileovima