const mongoose = require ('mongoose')

const AccommodationSchema = new mongoose.Schema({
    ownedby_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
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
    thumbnail:{
        type:String,
        required:false
    },
    gallery:{
        type:Array,
        required:false
    },
    headerphotos:{
        type:Array,
        required:false
    },
    content:[{
        type: Object,
        required:false,
        categoryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"AccommodationContentCategories",
        },
        contentId:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"AccommodationContent",
        }],     
    }],
    description:{
        type:String,
        required:false
    }
})

module.exports = mongoose.model('accommodationModel', AccommodationSchema) 
//Exportanje scheme za koristenje u drugim fileovima