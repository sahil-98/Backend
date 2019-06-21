/** {
      "name": "Peter Pan",
      "image": "images/alberto.png",
      "designation": "Chief Epicurious Officer",
      "abbr": "CEO",
      "description": "Our CEO, Peter, . . .",
      "featured": false
} */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Currency is used in to initialize price of any thing.
//Now Currency is set to the module of mongoos-currency
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const leaderSchema = new Schema({

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
    designation:{

        type: String,
        required: true,

    }, 
    abbr:{
        type:String,
        required: true,

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


var Leaders = mongoose.model('Leader',leaderSchema);
module.exports = Leaders;