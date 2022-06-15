const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config();
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

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
    res.status(200).json({name:res.person.name, surname: res.person.surname, email:res.person.email});
}

const updateBasicUserData = async (req,res)=>{
    if(req.body.name != null){
        res.person.name = req.body.name
    }
    if(req.body.surname != null){
        res.person.surname = req.body.surname
    }
    if(req.body.email != null){
        res.person.email = req.body.email
    }
    try{
        const person = await res.person.save()
        res.status(200).json(person)
    }catch(err){
        res.status(400).json({message:err})
    }
}

const deleteUser = async (req,res)=>{
    if (!username || !password) {
        return res.status(400).json("message: Bad user data")
    }
    try{
        await res.person.remove();
        res.status(200).json({message: 'Removed user sucessfully'})
    }catch(err){
        res.status(500).json({message: err});
    }
}

const updateUserPassword = async (req,res)=>{
    const {currentpassword,newpassword} = req.body;
    if (!currentpassword || !newpassword) {
        return res.status(400).json("message: Bad user data")
    }else if(!PWD_REGEX.test(newpassword)){
        return res.status(400).json({message:"Lozinka ne zadovoljava uvjete"})
    }

    const matchPassword = await bcrypt.compare(currentpassword, res.person.password);
    if (matchPassword) {
        const hashedpassword = await bcrypt.hash(newpassword,11)
        res.person.password = hashedpassword;
    }else{
        return res.status(403).json({message:"Kriva trenutna lozinka"})
    }

    try{
        const person = await res.person.save()
        res.status(200).json(person)
    }catch(err){
        res.status(400).json({message:err})
    }
}

module.exports = {
    getUsers,
    getUser,
    updateBasicUserData,
    updateUserPassword,
    deleteUser
}