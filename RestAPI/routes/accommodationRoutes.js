const express = require('express')
const router = express.Router()
const accommodationIdMiddleWare = require('../Middleware/getAccommodation')
const accommodationController = require('../Controller/accommodationController')
const verifyJWT = require('../Middleware/verifyJWT')
const verifyRoles = require('../Middleware/verifyRoles')
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/accommodation/');
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname);
    }
})

const fileFilter = (req,file,cb)=>{
    //accept a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true)
    }else{
        //reject a file
        cb(new Error('File Type not supported. Accepted formats are: (.jpeg | .png)'),false)
    }
}

const upload = multer({storage: storage, 
    limits:{
    fileSize: 1024*1024*5  
    },
    fileFilter:fileFilter
});

var multipleUpload = upload.fields([{name: 'images', maxCount:1}, {name: 'gallery', maxCount: 8}])

//Getting all users
router.route('/')
    .post(verifyJWT.verifyJWT,verifyRoles(9971),multipleUpload, accommodationController.addAccommodation) 
    .get(accommodationController.getAccommodations)
    

router.route('/:id')
    .get(accommodationIdMiddleWare.getAccommodation, accommodationController.getAccommodation)
    .delete()  //JWT TOKEN CHECK AND CHECK IF 

module.exports = router