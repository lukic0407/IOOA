const mongoose = require ('mongoose')

const accTypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('accTypes', accTypeSchema) 
//Exportanje scheme za koristenje u drugim fileovima