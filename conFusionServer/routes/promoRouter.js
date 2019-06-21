// Express router comes together with express we dont have to require or install it
const express = require('express');
const bodyParser = require('body-parser');


//We are requiring mongoose to use database opertions and using schema 
const mongoose = require('mongoose');
//we are requiring the data schema to be used
const Promotions = require('../models/promotions');

//This will declare promotions as an express router
//a mini express application
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

/*Now we would have give it a endpoint promotions but we are not giving it 
 as we will import it in index.js and will mount it */

promoRouter.route('/')

/*Actually we have created a general structure of what we have done in the index 
without express routing we are making a general structure and will export it  */
//.all is running on speified operator here '/'
.get((req,res,next)=>{
    //To retrieve or get the data we will use the below database method
        Promotions.find({})
         .then((Promotion) => {
             res.StatusCode = 200;
             res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
             res.json(Promotion); //It will put this in body of response message as json
        }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler  
    
    })
    
    .post((req,res,next)=>{
    
       Promotions.create(req.body)
       .then((Promotion) => {
            console.log('Dish Created',Promotion);
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
            res.json(Promotion); //Let the client know, what it has posted on the server
    
       }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler;
    
    })
    
    .put((req,res,next)=>{
        //403 not supported
        res.statusCode=403;
    
        res.end('PUT operation does not supported on /dishes ');
    
    })
    .delete((req,res,next) =>{
       Promotions.remove({})
       .then((resp) => {
        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
        res.json(resp); //Let the client know, what it has posted on the server
       }).catch((err) => next(err));
    })
    
    
    //for endpoint dishId
    promoRouter.route('/:promoId')
    
    /*Actually we have created a general structure of what we have done in the index 
    without express routing we are making a general structure and will export it  */
    //.all is running on speified operator here '/'
    /*.all((req,res,next)=> {
    
        res.statusCode=200;
        res.setHeader('Content-Type','text/plain');
        
        next();
    
    }) */
     .get((req,res,next)=>{
    
        Promotions.findById(req.params.promoId) //This method is in Mongodb driver and mongoose too
        .then((promotion) => {
             res.StatusCode = 200;
             res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
             res.json(promotion); //Let the client know, what it has posted on the server
     
        }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler;
     
    
    })
    
    .post((req,res,next)=>{
            //403 not supported
        res.statusCode=403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
        
    })
    
    .put((req,res,next)=>{
        
        Promotions.findByIdAndUpdate(req.params.promoId , {
            $set: req.body  //updat e will be in body of message
        },{new :true}) //so that findbyid method return updated dish as json
        .then((promotions) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
            res.json(promotions); //Let the client know, what it has updated on the server
    
         }).catch((err) => next(err));
    
    })
    .delete((req,res,next) =>{
        Promotions.findOneAndRemove(req.params.promoId)
        .then((respp) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
            res.json(respp); //Let the client know, what it has posted on the server
           }).catch((err) => next(err));
    });
    
    /** *************This Code written below is to hadnle comments************************************** */

//We are now exporting it 
module.exports = promoRouter;

