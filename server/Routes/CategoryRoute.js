const express = require('express');
const router = express.Router();
const categoryModel = require('../Models/CategoryModel');
const productModel = require('../Models/ProductsModel');

router.post('/add-new-category', (req, res) => {  
    const {category} = req.body;
    categoryModel.findOne({
        category : category
    }, (err, data) => {
        if(err){
            return res.status(500).send({
                success : false,
                message : "Error in saving category to DB",
                error : err
            })
        }
        if(data !== null){      //there is already the same category item present in the DB
            return res.status(200).send({
                success : false,
                message : "Already the same category present in the DB"
            })
        }
        else{
                const newModel = new categoryModel;
                newModel.category = category;
                newModel.save((er, categoryData) => {
                    if(er){
                        return res.status(500).send({
                            success : false,
                            message : "Error in saving category to DB",
                            error : er
                        })
                    }
                    return res.status(200).send({
                        success : true,
                        message : "Category Added to DB",
                        data : categoryData
                    })
                })
            // })
        }
    })
})

router.get('/get-categories', (req, res) => {
    categoryModel.find({

    }, (err, data) => {
        if(err){
            return res.status(500).send({
                success : false,
                message : "Error in saving category to DB",
                error : err
            })
        }
        if(data === null){
            return res.status(200).send({
                success : false,
                message : "No categories found in DB"
            })
        }
        else{
            let a = [];
            data && data.map((value, index) => {
                a.push(value.category);
            })
            return res.status(200).send({
                success : true,
                message : "Categories sent to DB",
                data : a
            })
        }
    })

})

module.exports = router;