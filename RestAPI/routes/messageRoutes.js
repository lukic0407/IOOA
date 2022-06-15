const express = require('express')
const router = express.Router()
const verifyJWT = require('../Middleware/verifyJWT')
const verifyRoles = require('../Middleware/verifyRoles')
const messageController = require('../Controller/messageController')
require('dotenv').config()

router.route('/accommodation/')
    .post(verifyJWT.verifyJWT, messageController.sendMessageFromAccommodation)
router.route('/')
    .post(verifyJWT.verifyJWT, messageController.sendMessage)
router.route('/:chatId')
    .get(verifyJWT.verifyJWT, messageController.allMessages)
    
module.exports = router