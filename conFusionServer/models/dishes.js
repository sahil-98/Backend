const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Currency is used in to initialize price of any thing.
//Now Currency is set to the module of mongoos-currency
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema ({ 

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment :{
        type: String,
        required:true

    },
    author: {
        type: String,
        required: true    
    }
},{  
    timestamps: true

});

const dishSchema = new Schema({

    /* In this LOC we are giving structure to the document */
    name: {
        type: String,  //we are giving the type of name as string
        required: true,  //by this loc we are ensuring that name is required in every document
        unique :true   //by this loc we are ensuring name should be unique in every code
    },
    description: {

        type: String,
        required: true
    },
    image : {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: ''
    },
    price:{
        type:Currency,  //We have required currency in Line 7
        required: true,
        min: 0
    },
    featured: {
       type:Boolean,
       default:false  

    }, 
    comments: [ commentSchema ] //The commentSchema documents becomes a sub document in dishes document
                                //we don't have to write structure for comments, as we added commentsSchema 
}, {
        timestamps: true  //This LOC providing (updated at) and (created at) in the document automatically

});


var Dishes = mongoose.model('Dish',dishSchema);
module.exports = Dishes;