const accommodationController = require('../Controller/accommodationController')
const express = require('express')
const router = express.Router()

router.route('/')
    .get(accommodationController.getAccommodationTypes)
    .post(accommodationController.addAccommodationType)
    
module.exports = router