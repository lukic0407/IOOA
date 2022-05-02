const accommodationModel = require('../models/accommodationModel');
//const multer = require('multer');
//const upload = multer({dest:'uploads/'});

const addAccommodation = async (req,res)=>{
    console.log("here")
    console.log(req.data);
    console.log(req.files);
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
        dateOfAddition
    } = req.body
    if(!name || !type || !tags || !street || !city || !contactNumber || !website){
        return res.status(400).json("message: Bad user data")
    }
    /*const duplicateUser = await userModel.find({username: username})
    console.log(duplicateUser.length)
    if(duplicateUser.length){
        return res.status(409).json("message: User already exists")
    }*/
   // const hashedpassword = await bcrypt.hash(password,11)
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
        images_single:images_single
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

module.exports = {
    addAccommodation
}

