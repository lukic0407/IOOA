const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
require('dotenv').config();

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const registerUser =  async (req,res)=>{
    const {username,email,password,name,surname} = req.body
    if(!username || !email || !password || !name || !surname){
        console.log("here");
        return res.status(400).json("message: Bad user data")
    }else if(!USER_REGEX.test(username) || !PWD_REGEX.test(password)){
        console.log("there");
        return res.status(400).json("message: Bad user data")
    }
    const duplicateUser = await userModel.find({username: username})
    if(duplicateUser.length){
        return res.status(409).json("message: User already exists")
    }
    const hashedpassword = await bcrypt.hash(password,11)
    const user = new userModel({
        username:username,
        name:name,
        surname:surname,
        email: email,
        password: hashedpassword,
        roles: {
            "owner": Number(process.env.OWNER_ROLE)
        }
    })
    try{
        //Kreiranje osobe i spremanje u bazu podataka i u varijablu newPerson kako bi mogli poslati nazad
        const newUser = await user.save(); 
        //status 201 - objekt kreiran
        res.status(201).json(newUser);
    }catch(err){
        //status 400 - User dao krive podatke
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    registerUser
}