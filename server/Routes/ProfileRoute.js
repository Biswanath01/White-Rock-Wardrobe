const express = require('express');
const router = express.Router();
const profileModel = require('../Models/ProfileModel');
const authModel = require("../Models/AuthModel");

//for past orders showing
router.post('/save-purchase-details/', async (req, res) => {
    const {userId, itemId} = req.body;
    const profileData = await profileModel.findOne({ userId: userId });
    // console.log(profileData);
    if(profileData === null){
        let a = itemId;
        let dates = [new Date().toJSON()];
        const purchaseDetails = new profileModel;
        purchaseDetails.userId = userId;
        purchaseDetails.itemId = itemId;
        // itemId.map((value, index) => {
        //     dates.push(new Date().toJSON());
        // })
        purchaseDetails.purchaseDate = dates;
        purchaseDetails.save((er, cd)=>{
            if(er){
                return res.status(500).send({
                    success: false,
                    message: "Error while saving to DB @1",
                    error: er
                })
            }
            return res.status(200).send({
                success: true,
                message: "Product Purchased Successfully@1"
            })
        });
    }
    else{
        profileModel.findOneAndUpdate({
            userId : userId 
        }, {
            $push : {itemId : itemId, purchaseDate : new Date().toJSON()}
        }, (err, data) => {
            if(err){
                return res.status(500).send({
                    message: "Some internal error occured!",
                    success : false,
                    error : err
                })
            }
            return res.status(200).send({
                success : true,
                message : "Product Purchased Successfully @2",
            })
        })
    }
})

router.get('/get-purchase-details/:userId', (req, res) => {
    const userId = req.params.userId;
    // console.log(userId);
    profileModel.findOne({
        userId : userId
    }, (err, data) => {
        if(err){
            return res.status(500).send({
                success: false,
                message: "Error while saving to DB",
                error: err
            }); 
        }
        if(data === null){
            return res.status(200).send({
                success : false,
                message : "No orders till now!"
            })
        }
        else{
            // console.log(data);
            let pData = [];
            pData.push({
                userId : data.userId,
                itemId : data.itemId,
                purchaseDate : data.purchaseDate
            })
            return res.status(200).send({
                success : true,
                message : "Sent the purchase details to the frontend",
                data : pData
            })
        }
    });
});

router.post('/get-past-orders/', (req, res) => {
    const {userId, value} = req.body;
    profileModel.findOne({
        userId : userId
    }, (err, data) => {
        if(err){
            return res.status(500).send({
                success: false,
                message: "Error while saving to DB",
                error: err
            }); 
        }
        if(data === null){
            return res.status(200).send({
                success : false,
                message : "No orders till now!"
            })
        }
        else{
            let currDate = Date.now();
            let pData = [];
            let days = 0;
            if(value === "1"){
                days = 7;
            }
            else if(value === "2"){ 
                days = 15;
            }
            else if(value === "3"){
                days = 30;
            }
            else if(value === "4"){
                days = 90;
            }
            else if(value === "5"){
                days = 180;
            }
            else if(value === "6"){
                days = 1000;
            }
           

            console.log("Yes got the date before ", days, " days@1");
            let prevDate = (Date.now() - days * 24 * 60 * 60 * 1000);
            for(let i=0; i<data.purchaseDate.length; i++){
                let purchaseD = (new Date(data.purchaseDate[i])).getTime();
                console.log("purchaseD", (data.purchaseDate[i]));
                if(purchaseD >= prevDate && purchaseD <= currDate){
                    pData.push({
                        userId : data.userId,
                        itemId : data.itemId[i],
                        purchaseDate : (data.purchaseDate[i])
                    })
                    console.log("Yes got the date before ", days, " days@2");
                }
            }

            return res.status(200).send({
                success : true,
                message : "Sent the purchase details to the frontend @DSG God",
                data : pData 
            })
        }
    });

})

module.exports = router;