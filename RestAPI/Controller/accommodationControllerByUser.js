const accommodationModel = require('../models/accommodationModel');

const getAccommodation = async(req,res)=>{
    let accommodation;
    const user_id = req?.user_id;
    try{ 
        accommodation = await accommodationModel.find({ownedby_id:user_id});
        if(accommodation==null){
            return res.status(404).json({message: 'Cannon find accommodation'})
        }
        //console.log(accommodation.name)
        res.status(200).json(accommodation);
    }catch(err){
        return res.status(500).json({message: err.message})
    }
}

const deleteAccommodation = async(req,res)=>{
    let accommodation;
    const user_id = req?.user_id;
    const acc_id = String(req.params.acc_id);
    try{ 
        accommodation = await accommodationModel.findOne({ownedby_id:user_id, _id:acc_id});
        if(accommodation==null){
            return res.status(404).json({message: 'Cannon find accommodation'})
        }
        console.log(accommodation);
        await accommodation.remove()
        res.status(200).json("Sucessfully deleted accommodation");
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
}

const updateAccommodation = async (req,res)=>{
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
    if(!user_id || !name || !type  || !street || !city || !contactNumber || !location ){
        return res.status(400).json("message: Bad user data")
    }
    
    try{
        const accommodation = await accommodationModel.findById(req.params.acc_id);
        accommodation.name = name;
        accommodation.tags = tags;
        accommodation.street = street;
        accommodation.city = city;
        accommodation.email = email;
        accommodation.type = accommodation.type;
        accommodation.contactNumber = contactNumber;
        accommodation.description = description;
        accommodation.website = website;
        accommodation.location = location;
        accommodation.services = services;
        accommodation.content = content;
        try{
            const newAccommodation = await accommodation.save(); 
            //status 201 - objekt kreiran
            return res.status(201).json(newAccommodation);
        }catch(err){
            //status 400 - User dao krive podatke
            return res.status(500).json({message: err.message})
        }
        if(acommodation==null){
            return res.status(404).json({message: 'Cannon find user'})
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }


}

module.exports = {
    getAccommodation,
    deleteAccommodation,
    updateAccommodation
}