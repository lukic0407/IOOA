const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginUser = async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !password) {
        return res.status(400).json("message: Bad user data")
    }
    const foundUser = await userModel.find({ username: username })
    if (!foundUser.length) {
        return res.status(401).json("message: No user found")
    }
    const matchPassword = await bcrypt.compare(password, foundUser[0]['password']);
    if (matchPassword) {
        const roles = Object.values(foundUser[0]['roles']).filter(Boolean)
        const accessToken = jwt.sign(
            { "userInfo":{
                "user_id": foundUser[0]['_id'].valueOf(),
                "username": foundUser[0]['username'],
                "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser[0]['username'] },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const currentUser = foundUser[0]
        const user_id = foundUser[0]['_id'].valueOf();
        currentUser.refreshToken = refreshToken
        const TokenUser = await currentUser.save(currentUser);
        res.cookie('jwt',refreshToken,{httpOnly:true, maxAage: 24 * 60 * 60 * 1000, sameSite: 'None', secure:true});
        res.status(200).json({accessToken, roles, user_id});
    } else {
        res.status(401).json("message: Wrong password")
    }
}

module.exports = {
    loginUser
}