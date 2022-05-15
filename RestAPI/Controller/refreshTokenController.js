const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async(req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt
    const foundUser = await userModel.find({ refreshToken: refreshToken })
    if (!foundUser.length) {
        return res.sendStatus(403)
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded) =>{
            if(err ||  foundUser[0]['username'] !== decoded.username) return res.sendStatus(403)
            console.log("signing token");
            const roles = Object.values(foundUser[0]['roles'])
            const accessToken = jwt.sign(
                {"userInfo":{
                    "user_id": foundUser[0]['_id'].valueOf(),
                    "username": decoded.username,
                    "roles": roles
                }},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            )
            const user_id = foundUser[0]['_id'].valueOf();
            res.json({accessToken,roles,user_id})
        }
    )
}

module.exports = {
    handleRefreshToken
}