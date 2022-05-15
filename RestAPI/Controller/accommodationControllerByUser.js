const accommodationModel = require('../models/accommodationModel');

const getAccommodation = async(req,res)=>{
    let accommodation;
    console.log(req.params);
    try{ 
        accommodation = await accommodationModel.find({ownedby_id:req.params.user_id});
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

    const{user_id, acc_id} = req.params;
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

module.exports = {
    getAccommodation,
    deleteAccommodation
}