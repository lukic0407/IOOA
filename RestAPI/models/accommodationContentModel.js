const mongoose = require ('mongoose')

const chatSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }});

module.exports = mongoose.model('AccommodationContent', chatSchema) 
//Exportanje scheme za koristenje u drugim fileovima