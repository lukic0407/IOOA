const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true
    },
    category_icon:{
        type: String,
        required: true
    },
    content:[{
        type:mongoose.Schema.Types.ObjectId,
        required: false,
        ref:"AccommodationContent"
    }]
})

module.exports = mongoose.model('AccommodationContentCategories', userSchema) 
//Exportanje scheme za koristenje u drugim fileovima