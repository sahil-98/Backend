/** {
      "name": "Weekend Grand Buffet",
      "image": "images/buffet.png",
      "label": "New",
      "price": "19.99",
      "description": "Featuring . . .",
      "featured": false
} */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Currency is used in to initialize price of any thing.
//Now Currency is set to the module of mongoos-currency
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({

    /* In this LOC we are giving structure to the document */
    name: {
        type: String,  //we are giving the type of name as string
        required: true,  //by this loc we are ensuring that name is required in every document
        unique :true   //by this loc we are ensuring name should be unique in every code
    },
    image : {
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
    description: {

        type: String,
        required: true
    },
    featured: {
       type:Boolean,
       default:false  

    }, 
},  
{
        timestamps: true  //This LOC providing (updated at) and (created at) in the document automatically

});


var Promotions = mongoose.model('Promotion',promotionSchema);
module.exports = Promotions;