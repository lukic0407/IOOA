const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
require('dotenv').config();

const registerUser =  async (req,res)=>{
    const {username,email,password} = req.body
    if(!username || !email || !password){
        return res.status(400).json("message: Bad user data")
    }
    const duplicateUser = await userModel.find({username: username})
    console.log(duplicateUser.length)
    if(duplicateUser.length){
        return res.status(409).json("message: User already exists")
    }
    const hashedpassword = await bcrypt.hash(password,11)
    const user = new userModel({
        username:username,
        email: email,
        password: hashedpassword,
        roles: {
            "owner": Number(process.env.OWNER_ROLE)
        }
    })
    try{
        //Kreiranje osobe i spremanje u bazu podataka i u varijablu newPerson kako bi mogli posalti to covjeku kao response
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