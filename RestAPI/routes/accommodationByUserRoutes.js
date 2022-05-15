const express = require('express');
const router = express.Router();
const accommodationControllerByUser = require('../Controller/accommodationControllerByUser');
const verifyJWT = require('../Middleware/verifyJWT');
const verifyRoles = require('../Middleware/verifyRoles');

router.route('/:user_id/:acc_id')
    .delete(verifyJWT.verifyJWT,verifyRoles(9971),accommodationControllerByUser.deleteAccommodation)
    
router.route('/:user_id')
    .get(verifyJWT.verifyJWT,verifyRoles(9971),accommodationControllerByUser.getAccommodation)
    

module.exports = router;
