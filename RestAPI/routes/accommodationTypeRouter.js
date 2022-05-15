const accommodationController = require('../Controller/accommodationController')
const express = require('express')
const router = express.Router()

router.route('/')
    .get(accommodationController.getAccommodationTypes)
    .post(accommodationController.addAccommodationType) //SECURITY RISK, ONLY ADMIN ACCESS (VERIFY ROLES)
    
module.exports = router