const express = require('express');
const router = express.Router();
const reviewModel = require('../Models/ReviewsModel');
const AuthModel = require('../Models/AuthModel');
const DpModel = require('../Models/DpModel');

router.post('/add-review/', (req, res)=>{
    const {userId, review, itemId, userRating} = req.body;
    let auth = AuthModel.findOne({
        userId : userId
    })
    if(auth === null){
        return res.status(404).send({
            success : false,
            message : "Your are not a authentic user! Aborting!"
        })
    }
    reviewModel.findOne({
        userId : userId,
        itemId : itemId
    }, (err, data) => {
        if(err){
            return res.status(500).send({
                success : false,
                message : "Internal server error in DB",
                error : err
            })
        }
        if(data !== null){
            return res.status(200).send({
                success : false,
                message : "You cannot review more than once"
            })
        }
        else{
            const newModel = new reviewModel;
            newModel.itemId = itemId;
            newModel.review = review;
            newModel.userId = userId;
            newModel.rating = userRating;
            newModel.createdAt = Date.now();
            newModel.save((error, saveData) => {
                if(error){
                    return res.status(500).send({
                        success : false,
                        message : "Internal server error in DB",
                        error : error
                    })
                }
                return res.status(200).send({
                    success: true,
                    message: "Review Added XD"
                });
            })
        } 
    })

});


router.get('/get-review/:itemId', async (req, res)=>{
    let queryItemId = req.params.itemId;
    // console.log(queryItemId);

    const reviewData = await reviewModel.find({
        itemId : queryItemId
    });
    // console.log((reviewData));
    if(reviewData.length === 0){
        return res.status(200).send({
            success : false,
            message : "No reviews found for this product"
        })
    }
    
    const data = [];
    for(const review of reviewData){
        const authData = await AuthModel.findOne({ userId: review.userId });
        const dpData = await DpModel.findOne({userId : review.userId});
        let dp64 = Buffer.from(dpData.userProfilePic.data).toString('base64');      //for image base 64 binary
        let mimetype = dpData.userProfilePic.contentType;
        let imageUrl = `data:${mimetype};base64,${dp64}`;
        // console.log(imageUrl);
        data.push({
            ...review._doc,
            userName: authData.userName,
            dp : imageUrl
        })
    }

    // console.log(data);
    return res.status(200).send({
        success: true,
        message : "Fetched reviews from DB XDDD",
        data : data.map((review, index) => {
            return {
                userName: review.userName,
                message: review.review,
                createdAt: review.createdAt,
                userId : review.userId,
                dp : review.dp,
                userRating : review.rating
            }
        })
    });
    
});

module.exports = router;


 
// old add review version
/*
const {userId, review, itemId} = req.body;
    const itemIdData = reviewModel.find({itemId: itemId});
    if(itemIdData!== null)
    {
        reviewModel.findOne({
            userId : userId,
            // review : review,
            itemId : itemId
        }, (err, data)=>{
            if(err){
                return res.send({
                    success : false,
                    message : "Internal DB Error",
                    error: err
                })
            }
            if(data!==null){
                return res.status(200).send({
                    success: false,
                    message: 'U cannot review more than once'
                })
            }
            else{
                const newModel = new reviewModel;
                newModel.userId = userId;
                newModel.review = review;
                newModel.itemId = itemId;
                newModel.createdAt = Date.now();
                newModel.save((error, saveData) => {
                    if(error){
                        return res.status(500).send({
                            success : false,
                            message : "Internal DB Error",
                            error: error
                        })
                    }
                    else{
                        return res.status(200).send({
                            success: true,
                            message : "Yay! Successfully added Review to DB"
                        });
                    }
                });
            }
        });
    }
    else{
        return res.status(404).send({
            success : false,
            message : "No such item. Enter valid itemId"
        })
    }

*/
    