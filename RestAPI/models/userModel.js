const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: false
    },
    dateOfRegistration:{
        type:Date,
        required: true,
        default: Date.now
    },
    password:{
        type:String,
        required: false
    },
    refreshToken:{
        type:String
    },
    roles:{
        type:JSON
    }
})

module.exports = mongoose.model('user', userSchema) 
//Exportanje scheme za koristenje u drugim fileovima