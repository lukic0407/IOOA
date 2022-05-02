const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogout = async(req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    const foundUser = await userModel.find({ refreshToken: refreshToken })

    if (!foundUser.length) {
        res.clearCookie('jwt',{httpOnly:true, sameSite: 'None', secure:true})
        return res.sendStatus(403)
    }
    const currentUser = foundUser[0]
    currentUser.refreshToken = ' '
    const TokenUser = await currentUser.save(currentUser)
    console.log(TokenUser)

    res.clearCookie('jwt',{httpOnly:true, sameSite: 'None', secure:true})
    res.sendStatus(204)
}

module.exports = {
    handleLogout
}