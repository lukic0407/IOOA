const userModel = require('../models/userModel')
const getUsers = async (req,res)=>{
    try{
        const users = await userModel.find()
        res.json(users);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

const getUser = (req,res)=>{
    console.log("sending user")
    res.send(res.person)
}

const updateUser = async (req,res)=>{
    if(req.body.name != null){
        res.person.name = req.body.name
    }
    if(req.body.height != null){
        res.person.height = req.body.height
    }
    if(req.body.dateOfRegistration != null){
        res.person.dateOfRegistration = req.body.dateOfRegistration
    }
    try{
        const person = await res.person.save()
        res.status(200).json(person)
    }catch(err){
        res.status(400).json({message:err})
    }
}

const deleteUser = async (req,res)=>{
    try{
        await res.person.remove();
        res.status(200).json({message: 'Removed user sucessfully'})
    }catch(err){
        res.status(500).json({message: err});
    }
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser
}