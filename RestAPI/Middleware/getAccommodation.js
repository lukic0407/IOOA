const accommodationModel = require('../models/accommodationModel');

async function getAccommodation(req, res, next){
    let accommodation;
    try{
        
        accommodation = await accommodationModel.findById(req.params.id);
        if(accommodation==null){
            return res.status(404).json({message: 'Cannon find accommodation'})
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }
    console.log(accommodation.name)
    res.accommodation = accommodation;
    next()
}

module.exports = {
    getAccommodation
}