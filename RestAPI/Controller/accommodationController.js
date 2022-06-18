const accommodationModel = require('../models/accommodationModel');
const accommodationContentModel = require('../models/accommodationContentModel');
const accommodationContentCategoriesModel = require('../models/acommodationContentCategoriesModel');
const accommodationTypeModel = require('../models/typesModel')
//const multer = require('multer');
//const upload = multer({dest:'uploads/'});

const addAccommodation = async (req,res)=>{
    //console.log(req.data);
    var thumbnail= '';
    if(req?.files?.thumbnail){
        thumbnail = req?.files?.thumbnail[0]?.path;
    }

    const gallery = [];
    if(req.files?.gallery){
    req.files?.gallery.forEach(obj =>{
        Object.entries(obj).forEach(([key,value])=>{
            if(key=='path'){
                gallery.push(value);
            }
        })
    })
    }
    console.log(req.body);
    const headerphotos = [];
    if(req.files?.headerphotos){
        req.files?.headerphotos.forEach(obj =>{
            Object.entries(obj).forEach(([key,value])=>{
                if(key=='path'){
                    headerphotos.push(value);
                }
            })
        })
        }

    const {
        name,
        tags,
        street,
        city,
        email,
        type,
        contactNumber,
        description,
        website, //
        location,
        services,
        content,
        dateOfAddition,
        
    } = req.body
    const user_id = req?.user_id;
    console.log(req.body);
    if(!user_id || !name || !type  || !street || !city || !contactNumber ){
        return res.status(400).json("message: Bad user data")
    }
    const accommodation = new accommodationModel({
        ownedby_id:user_id,
        name:name,
        type:type,
        tags:tags,
        street:street,
        city:city,
        email:email,
        contactNumber:contactNumber,
        website:website,
        dateOfAddition:dateOfAddition,
        thumbnail:thumbnail,
        gallery:gallery,
        headerphotos:headerphotos,
        location:JSON.parse(location),
        services:services,
        content:JSON.parse(content),
        description:description
    })
    try{
        const newAccommodation = await accommodation.save(); 
        //status 201 - objekt kreiran
        res.status(201).json(newAccommodation);
    }catch(err){
        //status 400 - User dao krive podatke
        res.status(500).json({message: err.message})
    }
}

const addAccommodationContent = async (req, res) => {
    var icon = '';
    if (req?.files?.icon) {
        icon = req?.files?.icon[0]?.path;
    }

    const {
        name,
        category,
    } = req.body

    
    if (!category || !icon || !name) {
        return res.status(400).json("message: Bad user data")
    }

    const findAccommodationContent = await accommodationContentModel.find({ category: category });
    if (!findAccommodationContent) {

    } else {
        console.log("category");
        
        const content = [{ icon: icon, name: name }];
        const accommodationContent = new accommodationContentModel({
            category: category,
            content: content
        })
        try {
            const newAccommodationContent = await accommodationContent.save();
            //status 201 - objekt kreiran
            res.status(201).json(newAccommodationContent);
        } catch (err) {
            //status 400 - User dao krive podatke
            res.status(500).json({ message: err.message })
        }

    }
}

const getAccommodations = async (req,res)=>{
    try{
        const accommodations = await accommodationModel.find();
        
        res.json(accommodations);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

const getAccommodation = async (req,res)=>{
    var newCategoryIdArray = [];
    var newContentIdArray = [];
    var newContentArray = [];
    const content = res.accommodation.content;
    console.log(content);
    for (let index = 0; index < content.length; index++) {
        const element = content[index];
        const category = await accommodationContentCategoriesModel.findById(element.categoryId);
        var contentIdArray = element.contentId;
        if(contentIdArray?.length>0){
        for (let index = 0; index < contentIdArray.length; index++) {
            const element = contentIdArray[index];
            const content = await accommodationContentModel.findById(element);
            newContentIdArray = [...newContentIdArray,content];
        }}
        newCategoryIdArray = {...newCategoryIdArray,category};
        newContentArray = [...newContentArray,{categoryId:category,contentId:newContentIdArray}];
    }
    
    res.accommodation.content = newContentArray;
    //console.log(newContentArray);
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
    addAccommodationContent,
    getAccommodations,
    getAccommodation,
    addAccommodationType,
    getAccommodationTypes
}

