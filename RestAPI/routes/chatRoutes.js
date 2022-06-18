const express = require('express')
const router = express.Router()
const verifyJWT = require('../Middleware/verifyJWT')
const verifyRoles = require('../Middleware/verifyRoles')
const chatController = require('../Controller/chatController')
require('dotenv').config()


router.route('/')
    .post(verifyJWT.verifyJWT, chatController.accessChat)
    .get(verifyJWT.verifyJWT, chatController.fetchChats)
    
module.exports = router