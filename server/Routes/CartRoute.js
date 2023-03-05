const express = require('express');
const uuid = require('uuid');
const lodash = require('lodash');

const router = express.Router();    //router is used to handle and route the data coming form the frontend
const cartModel = require('../Models/CartModel');
const productModel = require('../Models/ProductsModel');

router.post('/add-to-cart/',  async(req, res)=>{
    const {itemId, userId} = req.body;
    const itemIdData = await productModel.findOne({
        itemId : itemId,
    });
    if(itemIdData !== null){
        const cartData = await cartModel.findOne({
            userId : userId
        })
        if(cartData === null){
            //if the user is not present i.e. he has not added anthing in the cart
            const newModel = new cartModel;
            newModel.userId = userId;
            newModel.itemId = [itemId];
            // console.log("This is itemId", itemId);
        
            newModel.save((er, cd)=>{
                if(er){
                    return res.status(500).send({
                        success: false,
                        message: "Error while saving to DB @1",
                        error: er
                    })
                }
                return res.status(200).send({
                    success: true,
                    message: "Added Item to Cart"
                })
            });
        }
        else{
            if(cartData.itemId.includes(itemId) === true){
                return res.status(200).send({
                    success: false,
                    message: "U have already the Item present in the Cart"
                })
            }
            else{
                cartModel.findOneAndUpdate({
                    userId : userId
                }, {
                    $push: { "itemId" : itemId }
                }, (error, cData) => {
                    if(error){
                        return res.status(500).send({
                            success: false,
                            message: "Error while saving to DB @2",
                            error: error
                        })
                    }
                    else{
                        return res.status(200).send({
                            success : true,
                            message : "DSG God added items to cart!"
                        })
                    }
                })
            }
            //iterate throught the array and find if the item is already present in the array
            // if yes then u are noob. duplictae is already present
            // else add the item to the array
        }
        
       
    }
}) 

//to send data from backend to frontend(display the cart) =>
// this will happen in product route page where the itemid is posted and then we will map through the
// entire product list and then will send the details to the frontend

router.get('/get-cart-items/:userId', (req, res)=>{
    const userId = req.params.userId;
    // console.log(userId);
    cartModel.findOne({
        userId : userId
    }, (err, data)=>{
        if(err){
            return res.status(500).send({
                success: false,   
                message: "Internal Error of DB"
            })
        }
        if(data === null){
            return res.status(200).send({
                success: false,
                message: "No item present in cart. Pls add item to cart"
            }) 
        }
        
        // console.log(data.itemId);

        return res.status(200).send({
            success: true,
            message: "Data send to Frontend @1",
            data: data.itemId
        });
    });
})


router.post('/delete-from-cart/', async (req, res)=>{
    const {itemId, userId} = req.body;
    const data = await cartModel.findOne({
        userId : userId 
    })

    if(data === null){
        return res.status(200).send({
            success : false,
            message : "U have not added anthing to the cart!"
        });
    }

    else{
        let cd = [];
        cd = data.itemId;
        // console.log("This is cartData:",cd);
        if(cd.includes(itemId) === true){
            cartModel.findOneAndUpdate({
                userId : userId
            }, {
                $pull : {"itemId" : itemId}
            } , (error, deleteData)=>{
                if(error){ 
                    return res.status(500).send({
                        success : false,
                        message : "Error in deleting the data",
                        error : error
                    });
                }
                else{
                    return res.status(200).send({
                        success : true,
                        message : "Item removed from cart successfully!"
                    });
                }
            });
        }
        else{
            return res.status(200).send({
                success : false,
                message : "No such item present in cart!"
            });
        }
        
    }
});


router.post('/delete-multiple-items/', (req, res) => {
    const {userId, itemIdList} = req.body; 
    const a = cartModel.findOne({
        userId : userId
    })
    if(a === null){
        return res.status(200).send({
            success : false, 
            message : "You have no items in the cart!"
        });
    }
    else{
        let statuses = [];   
        cartModel.findOneAndUpdate({
            userId : userId 
        }, { 
            $pull : {itemId : {$in: itemIdList}} 
        }, (err, data) => {
            if(err){
                statuses.push(0); 
            } 
            else{
                statuses.push(1);
            }
        })
        
        if(statuses.includes(0) === false){
            return res.status(200).send({
                success : true,
                message : "Item removed from cart successfully!"
            });
        }
        else{
            return res.status(500).send({
                success : false,
                message : "Error in deleting the data",
                error : error
            });
        }
        // let statuses = [];
        // itemIdList.map((value, index) => { 
        //     cartModel.findOneAndUpdate({
        //         userId : userId 
        //     }, {
        //         $pull : {"itemId" : value}
        //     } , (error, deleteData)=>{
        //         if(error){ 
        //             statuses.push(0);
        //         }
        //         else{
        //             statuses.push(1);
        //         }
        //     });
        // })
        // if(statuses.includes(0) === false){
        //     return res.status(200).send({
        //         success : true,
        //         message : "Item removed from cart successfully!"
        //     });
        // }
        // else{
        //     return res.status(500).send({
        //         success : false,
        //         message : "Error in deleting the data",
        //         error : error
        //     });
        // }
    }
})

//exporting router
module.exports = router;
