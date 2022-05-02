const mongoose = require ('mongoose')

const roleSchema = new mongoose.Schema({
    role:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('role', roleSchema) 
//Exportanje scheme za koristenje u drugim fileovima