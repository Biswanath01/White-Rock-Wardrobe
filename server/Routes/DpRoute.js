const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const authModel = require('../Models/AuthModel');
const dpModel = require('../Models/DpModel');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let upload = multer({
    storage,
    fileFilter
});

router.post('/save-profile-pic/:userId', upload.single("image"), async(req, res) => {
    const userId = req.params.userId;
    const authData = await authModel.findOne({
        userId : userId
    })
    if(authData === null){
        return res.status(404).send({
            success : false,
            message : "No such user Present!"
        })
    }
    
    dpModel.findOne({
        userId : userId
    }, (err, data) => {
        if(err){
            return res.send({
                success : false,
                message : "Error in saving to DB",
                error : err
            })
        }

        if(data === null){
            const newModel = new dpModel;
            newModel.userProfilePic = {
                data: fs.readFileSync(path.join(__dirname, '../uploads/' + req.file.filename)),
                contentType: req.file.mimetype
            }
            newModel.userId = userId;
            newModel.save((error, dpData) => {
                if(error){
                    return res.status(500).send({
                        success: false,
                        message: "Error while saving to DB",
                        error: error
                    })
                }
                else{
                    return res.status(200).send({
                        success : true,
                        message : "User DP saved to DB",
                        // data : {
                        //     profilePic : profilePic
                        // }
                    });
                }
            });
        }
        // else{
        //     newModel.userId = userId;
        //     newModel.save((error, dpData) => {
        //         if(error){
        //             return res.status(500).send({
        //                 success: false,
        //                 message: "Error while saving to DB",
        //                 error: error
        //             })
        //         }
        //         else{
        //             return res.status(200).send({
        //                 success : true,
        //                 message : "User DP saved to DB",
        //                 data : {
        //                     profilePic : profilePic
        //                 }
        //             });
        //         }
        //     });
        // }
        //for deleting the files in uploads folder
        const dirPath = path.join(__dirname, '../uploads/');
        fs.readdir(dirPath, (err, images) => {
            if (err) {
                console.log('Unable to scan directory: ' + err);
            } 
    
            images.forEach((image) => {
                fs.unlink(dirPath + image, (e) => console.log(e))
        })});

    })
});

//one time route for just getting the status of the 3 initial users
router.post('/get-dp-stats/', async (req, res) => {
    const { userId } = req.body;
    const dpData = await dpModel.findOne({ userId: userId });

    if(dpData === null){
        return res.status(404).send({
            success: false,
            message: "Dp not found for this user"
        });
    } 
    else {
        var sendDpData = [];
        let dp64 = Buffer.from(dpData.userProfilePic.data).toString('base64');      //for image base 64 binary
        let mimetype = dpData.userProfilePic.contentType;
        let imageUrl = `data:${mimetype};base64,${dp64}`;
        sendDpData.push({
            userDp : imageUrl,
            userId : userId
        })
        return res.status(200).send({
            success: true,
            message: "Cool! Dp found, Let's proceed to main page!",
            data : sendDpData
        });
    }
})

module.exports = router;