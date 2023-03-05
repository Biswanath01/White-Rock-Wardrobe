const mongoose = require('mongoose');

const profileModel = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    itemId : {
        type : Array,
        required : true
    },
    purchaseDate : {
        type : Array,
        required : true
    } 

    // itemId : {
    //     type : String,
    //     required : true
    // },
    // purchaseDate : {
    //     type : Date,
    //     required : true
    // }
})

module.exports = mongoose.model('ProfileModels', profileModel);