const userModel = require('../models/userModel')

async function getUser(req, res, next){
    let person;
    try{
        person = await userModel.findById(req.params.userid);
        if(person==null){
            return res.status(404).json({message: 'Cannon find user'})
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }
    res.person = person;
    next()
}

async function getUserToUpdate(req, res, next){
    let person;
    try{
        person = await userModel.findById(req.user_id);
        if(person==null){
            return res.status(404).json({message: 'Cannon find user'})
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }
    res.person = person;
    next()
}

module.exports = {
    getUser,
    getUserToUpdate
}