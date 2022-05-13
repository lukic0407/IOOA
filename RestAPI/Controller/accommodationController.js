const accommodationModel = require('../models/accommodationModel');
const accommodationTypeModel = require('../models/typesModel')
//const multer = require('multer');
//const upload = multer({dest:'uploads/'});

const addAccommodation = async (req,res)=>{
    var images_single = '';
    if(req?.files?.images){
        images_single = req?.files?.images[0]?.path;
    }
    const images_multiple = [];

    if(req.files?.gallery){
    req.files?.gallery.forEach(obj =>{
        Object.entries(obj).forEach(([key,value])=>{
            if(key=='path'){
                images_multiple.push(value);
            }
        })
    })
    }

    const {name,
        type,
        tags, //
        street,
        city,
        email,
        contactNumber, // 
        website, //
        dateOfAddition,
        location,
    } = req.body

    console.log(req.body);
    if(!name || !type || !tags || !street || !city || !contactNumber || !website){
        return res.status(400).json("message: Bad user data")
    }
    const accommodation = new accommodationModel({
        name:name,
        type:type,
        tags:tags,
        street:street,
        city:city,
        email:email,
        contactNumber:contactNumber,
        website:website,
        dateOfAddition:dateOfAddition,
        images_single:images_single,
        location:JSON.parse(location)
    })
    try{
        //Kreiranje osobe i spremanje u bazu podataka i u varijablu newPerson kako bi mogli posalti to covjeku kao response
        const newAccommodation = await accommodation.save(); 
        //status 201 - objekt kreiran
        res.status(201).json(newAccommodation);
    }catch(err){
        //status 400 - User dao krive podatke
        res.status(500).json({message: err.message})
    }
}

const getAccommodations = async (req,res)=>{
    try{
        const accommodations = await accommodationModel.find()
        res.json(accommodations);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

const getAccommodation = (req,res)=>{
    res.send(res.accommodation);
}

const addAccommodationType = async (req,res)=>{
    const {name} = req.body
    if(!name){
        return res.status(400).json("message: Bad user data")
    }
    const accommodationtype = new accommodationTypeModel({
        name:name
    })
    try{
        const newAccommodationtype = await accommodationtype.save(); 
        //status 201 - objekt kreiran
        res.status(201).json(newAccommodationtype);
    }catch(err){
        //status 400 - User dao krive podatke
        res.status(500).json({message: err.message})
    }
}

const getAccommodationTypes = async (req,res)=>{
    try{
        const accommodationTypes = await accommodationTypeModel.find()
        res.json(accommodationTypes);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    addAccommodation,
    getAccommodations,
    getAccommodation,
    addAccommodationType,
    getAccommodationTypes
}

