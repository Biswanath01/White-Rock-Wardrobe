const mongoose = require('mongoose');

const CategoryModel = new mongoose.Schema({
    category : {
        type: String,
        required : true  
    },
    // itemIds : {
    //     type: Array
    // }

})

module.exports = mongoose.model("CategoryModel", CategoryModel);