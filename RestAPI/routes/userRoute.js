const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const userIdMiddleWare = require ('../Middleware/getUserById')
const verifyJWT = require('../Middleware/verifyJWT')
const verifyRoles = require('../Middleware/verifyRoles')
require('dotenv').config()


//Getting all users
router.route('/')
    .get(userController.getUsers)

router.route('/:id')
    .get(verifyJWT.verifyJWT,verifyRoles(9971),userIdMiddleWare.getUser, userController.getUser)
    .patch(userIdMiddleWare.getUser, userController.updateUser)
    .delete(userIdMiddleWare.getUser, userController.deleteUser)
    


module.exports = router