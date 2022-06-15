const accommodationModel = require('../models/accommodationModel');

async function getAccommodation(req, res, next){
    let accommodation;
    console.log("dadadada"+req.params.id);
    try{
        
        accommodation = await accommodationModel.findById(req.params.id).populate("ownedby_id", "_id name surname picture");
        if(accommodation==null){
            return res.status(404).json({message: 'Cannon find accommodation'})
        }

    }catch(err){
        return res.status(500).json({message: err.message})
    }
    res.accommodation = accommodation;
    next()
}

module.exports = {
    getAccommodation
}