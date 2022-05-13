const mongoose = require ('mongoose')

const AccommodationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    tags:{
        type: String,
        required: false
    },
    street:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    contactNumber:{
        type: String,
        required: false
    },
    website:{
        type: String,
        required: false
    },
    dateOfAddition:{
        type:Date,
        required: true,
        default: Date.now
    },
    location:{
        type:Object,
        required: true
    },
    images_single:{
        type:String,
        required:false
    },
    images_multiple:{
        type:Array,
        required:false
    }
})

module.exports = mongoose.model('accommodationModel', AccommodationSchema) 
//Exportanje scheme za koristenje u drugim fileovima