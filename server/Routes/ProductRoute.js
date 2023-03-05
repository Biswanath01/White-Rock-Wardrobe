const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const productModel = require('../Models/ProductsModel');
const authModel = require('../Models/AuthModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const lodash = require("lodash");

const storage = multer.diskStorage({ 
    destination: function(req, file, cb){
        cb(null, 'Images');
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

router.post('/sell-product-data/', upload.single("image") ,async (req, res)=>{
    const {userId, category, description, title, price, count, rate} = req.body;
    const authData = await authModel.findOne({
        userId : userId
    })
    if(authData===null){
        return res.status(404).send({
            success : false,
            message : "404 Not Found"
        });
    }
    else{
        productModel.findOne({
            title : title,
            description : description,
            category : category,
            userId : userId  
        }, (err,data)=>{
            if(err){
                return res.status(500).send({
                    success : false,
                    message : "Error saving to DB",
                    error : err
                });
            }
            if(data!==null){
                return res.status(400).send({
                    success : false,
                    message : "Duplicate item already present"
                }); 
            }
            else{
                const newModel = new productModel;
                newModel.itemId = uuid.v4();
                newModel.userId = userId;
                newModel.title = title;
                newModel.description = description;
                newModel.price = price;
                newModel.category = category;
                newModel.rating.rate = rate;
                newModel.rating.count = count;
                newModel.image = {
                    data : fs.readFileSync(path.join(__dirname, '../Images/' + req.file.filename)), 
                    contentType : req.file.mimetype

                }
                newModel.save((error, sellData)=>{
                    if(error){
                        return res.status(500).send({
                            success: false,
                            message: "Error while saving to DB",
                            error: error
                        });
                    }
                    return res.status(200).send({
                        success: true,
                        message: "Selling Product added to DB"
                    });
                });
            }
        });
    }
});


router.get('/get-products/', async (req, res) => {
    const productsData = await productModel.find({});
    // let price_filter = req.query.pricemin;
    // let category_filter = req.query.category;
    // let price_ascending = req.query.ascending;

    if(productsData === null){
        return res.status(400).send({
            success: "False",
            message: "No products up for sale!"
        });
    } 
    else {
        var pData = [];
        for(const product of productsData){
            const userData = await authModel.findOne({  userId: product.userId });
            let dp64 = Buffer.from(product.image.data).toString('base64');      //for image base 64 binary
            let mimetype = product.image.contentType;
            let imageUrl = `data:${mimetype};base64,${dp64}`
            pData.push({
                title: product.title,
                description: product.description,
                category: product.category,
                price: product.price,
                userName: userData.userName,
                itemId : product.itemId,
                image : imageUrl,
                rate : product.rating.rate,
                count : product.rating.count
            });  
        }
        // console.log(pData);
        // if(price_filter){
        //     pData = pData.filter((product) => product.productPrice > price_filter);
        // }

        // if(category_filter){
        //     pData = pData.filter((product)=> product.productCategory.toLowerCase() === category_filter.toLowerCase());
        // }
        // console.log(pData);

        // var price_arr = [];
        // if(price_ascending.toLowerCase()==="true"){
        //     for(let i=0; i<pData.length; i++)
        //     {
        //         price_arr.push(pData[i].productPrice);
        //     }
        //     price_arr.sort();
        // }
        // else{
        //     for(let i=0; i<pData.length; i++)
        //     {
        //         price_arr.push(pData[i].productPrice);
        //     }
        //     price_arr.sort();
        //     price_arr.reverse();
        // }
        // console.log(price_arr); 

        return res.status(200).send({
            success: "True",
            products: pData,
            message : "All the Product Details send the Frontend"
            // price_array: price_arr
        });
    }
});


// itemid is posted as req.body from the frontend and then we will map through the
// entire product list and then will send the details to the frontend

router.post('/product-data-for-cart/', async (req, res)=> {
    // if(itemId from the frontend === user item found by mapping the product model) 
    // {
    //     send the details to the frontend
    // }
    const { itemId } = req.body;
    const productData = [];
    // console.log(itemId);

    if(itemId === [] || itemId === undefined || itemId === null){
        return res.status(200).send({
            success : false,
            message : "No products in the cart"
        })
    }
    
    for(let id of itemId){
        // console.log(id);
        const pData = await productModel.findOne({ itemId: id });
        // console.log(pData);
        if(pData === null){
            return res.status(400).send({
                success : false,
                message : "No such product available!"
            });
        } 
        else {
            const sellerData = await authModel.findOne({ userId: pData.userId });
            let productImage64 = Buffer.from(pData.image.data).toString('base64');
            let mimeType = pData.image.contentType;
            let imageUrl = `data:${mimeType};base64,${productImage64}`;

            productData.push({
                ...pData._doc,
                userName: sellerData.userName,
                imageUrl: imageUrl
            });
        }
    }

    return res.status(200).send({
        success : true,
        message : "Send the data of products in cart to Frontend",
        data: productData.map((object, index) => {
            return lodash.pick(object, "itemId", "title", "description", "price", "rating", "category", "userName", "imageUrl")
        })
    });
})

router.post('/get-specific-category/', async(req, res) => {
    const {category} = req.body;
    const productsData = await productModel.find({
        category : {$in : category}
    });

    if(productsData === null){
        return res.status(400).send({
            success: "False",
            message: "No such category in DB!"
        });
    } 
    else {
        var pData = [];
        for(const product of productsData){
            const userData = await authModel.findOne({  userId: product.userId });
            let dp64 = Buffer.from(product.image.data).toString('base64');      //for image base 64 binary
            let mimetype = product.image.contentType;
            let imageUrl = `data:${mimetype};base64,${dp64}`
            pData.push({
                title: product.title,
                description: product.description,
                category: product.category,
                price: product.price,
                userName: userData.userName,
                itemId : product.itemId,
                image : imageUrl,
                rate : product.rating.rate,
                count : product.rating.count
            });  
        }

        return res.status(200).send({
            success: "True",
            products: pData,
            message : "All the Category Details send the Frontend"
        });
    }
}) 

router.post('/modify-reviews/', async(req, res) => {
    const {itemId, userRating} = req.body;
    const prodData = await productModel.findOne({
        itemId : itemId
    });
    if(prodData === null){
        return res.status(200).send({ 
            success : false,
            message : "No such product present in DB"
        })
    }
    else{
        // console.log(prodData);
        let newReviewCount = prodData.rating.count + 1;
        let newRating = (((prodData.rating.rate)*(prodData.rating.count)) + userRating)/(((prodData.rating.count)+1));
                        // ((average rating)*(count of people rated) + new user rating)/(count of people rated + 1)
        if(newRating > 10){
            newRating = newRating / 10; 
        }
        r = {
            count : newReviewCount,
            rate : newRating
        }
        productModel.updateOne({
            itemId : itemId
        }, {
            $set : {rating : r}
        }, (err, data) => {
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error while saving review data to DB",
                    error: err
                });
            }
            return res.status(200).send({
                success: true,
                message: "Review Modified",
                data : r
            });
        })
    }
});

router.post('/get-search/', async (req, res) => {
    const {search} = req.body;
    const data = await productModel.find({});
    if(data === null){
        return res.status(200).send({
            success : false,
            message : "No products present!"
        })
    }
    else{
        let itemIds = [];
        // console.log(data);
        data && data.map((value, index) => {
            if(value.title.toLowerCase().includes(search.toLowerCase()) || value.description.toLowerCase().includes(search.toLowerCase())){
                itemIds.push(value.itemId);
            }
        });
        
        return res.status(200).send({
            success : true,
            message : "The search term is found!",
            data : itemIds
        });
    }
})


module.exports = router;