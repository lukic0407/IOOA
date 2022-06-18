const express = require('express');
const router = express.Router();
const accommodationControllerByUser = require('../Controller/accommodationControllerByUser');
const verifyJWT = require('../Middleware/verifyJWT');
const verifyRoles = require('../Middleware/verifyRoles');


const multer = require('multer');
const storageAccommodation = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/accommodation/');
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname);
    }
})
const storageAccommodationContent = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/accommodation/content');
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname);
    }
})
const fileFilter = (req,file,cb)=>{
    //accept a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        console.log("pass");
        cb(null,true)
    }else{
        //reject a file
        console.log("fail");
        cb(new Error('File Type not supported. Accepted formats are: (.jpeg | .png)'),false)
    }
    console.log(file);
}

const uploadAccommodation = multer({storage: storageAccommodation, 
    limits:{
    fileSize: 1024*1024*5  
    },
    fileFilter:fileFilter
});

const uploadContent = multer({storage: storageAccommodationContent, 
    limits:{
    fileSize: 1024*1024*5  
    },
    fileFilter:fileFilter
});

var multipleUpload = uploadAccommodation.fields([ {name: 'headerphotos', maxCount:3},{name: 'thumbnail', maxCount: 1}, {name: 'gallery', maxCount: 12}]);
var accommodationContentUpload = uploadContent.fields([{name: 'icon', maxCount:1}]);


router.route('/all')
    .get(verifyJWT.verifyJWT,verifyRoles(9971),accommodationControllerByUser.getAccommodation)
 
router.route('/:acc_id')
    .delete(verifyJWT.verifyJWT,verifyRoles(9971),accommodationControllerByUser.deleteAccommodation)
    .patch(verifyJWT.verifyJWT,verifyRoles(9971), multipleUpload,accommodationControllerByUser.updateAccommodation)
    
   

module.exports = router;
