const express = require('express')
const router = express.Router()
const authController = require('../Controller/authController')
const registerController = require('../Controller/registerController')
const refreshTokenController = require('../Controller/refreshTokenController')
const logoutController = require('../Controller/logoutController')

router.route('/register')
    .post(registerController.registerUser)

router.route('/login')
    .post(authController.loginUser)

router.route('/logout')
    .get(logoutController.handleLogout)

router.route('/refresh')
    .get(refreshTokenController.handleRefreshToken)

module.exports = router