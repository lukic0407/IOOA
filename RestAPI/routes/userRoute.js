const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const userIdMiddleWare = require ('../Middleware/getUserById')
const verifyJWT = require('../Middleware/verifyJWT')
const verifyRoles = require('../Middleware/verifyRoles')
require('dotenv').config()


//Getting all users
router.route('/userdata/changepassword')
    .patch(verifyJWT.verifyJWT,verifyRoles(9971),userIdMiddleWare.getUserToUpdate, userController.updateUserPassword) 

router.route('/userdata/:userid?')
    .get(userIdMiddleWare.getUser, userController.getUser)
    .patch(verifyJWT.verifyJWT,verifyRoles(9971),userIdMiddleWare.getUserToUpdate, userController.updateBasicUserData) 
    //.delete(verifyJWT.verifyJWT,verifyRoles(3737),userIdMiddleWare.getUser, userController.deleteUser) 
    


module.exports = router