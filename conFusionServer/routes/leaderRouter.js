// Express router comes together with express we dont have to require or install it
const express = require('express');
const bodyParser = require('body-parser');

//We are requiring mongoose to use database opertions and using schema 
const mongoose = require('mongoose');
//we are requiring the data schema to be used
const Leaders = require('../models/leaders');

//This will declare promotions as an express router
//a mini express application
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

/*Now we would have give it a endpoint promotions but we are not giving it 
 as we will import it in index.js and will mount it */

leaderRouter.route('/')

/*Actually we have created a general structure of what we have done in the index 
without express routing we are making a general structure and will export it  */
//.all is running on speified operator here '/'
.get((req,res,next)=>{
    //To retrieve or get the data we will use the below database method
        Leaders.find({})
         .then((Leader) => {
             res.StatusCode = 200;
             res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
             console.log("hello People",Leader);
             res.json(Leader); //It will put this in body of response message as json
        }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler  
    
    })
    
    .post((req,res,next)=>{
    
       Leaders.create(req.body)
       .then((Leader) => {
            console.log('Dish Created',Leader);
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
            res.json(Leader); //Let the client know, what it has posted on the server
    
       }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler;
    
    })
    
    .put((req,res,next)=>{
        //403 not supported
        res.statusCode=403;
    
        res.end('PUT operation does not supported on /dishes ');
    
    })
    .delete((req,res,next) =>{
       Leaders.remove({})
       .then((resp) => {
        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
        console.log("Huawei",resp);
        res.json(resp); //Let the client know, what it has posted on the server
       }).catch((err) => next(err));
    })
    
    
    //for endpoint dishId
    leaderRouter.route('/:leaderId')
    
    /*Actually we have created a general structure of what we have done in the index 
    without express routing we are making a general structure and will export it  */
    //.all is running on speified operator here '/'
    /*.all((req,res,next)=> {
    
        res.statusCode=200;
        res.setHeader('Content-Type','text/plain');
        
        next();
    
    }) */
     .get((req,res,next)=>{
    
        Leaders.findById(req.params.leaderId) //This method is in Mongodb driver and mongoose too
        .then((leader) => {
             res.StatusCode = 200;
             res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
             console.log("Sahil Kapoor",leader);
             res.json(leader); //Let the client know, what it has posted on the server
     
        }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler;
     
    
    })
    
    .post((req,res,next)=>{
            //403 not supported
        res.statusCode=403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
        
    })
    
    .put((req,res,next)=>{
        
        Leaders.findByIdAndUpdate(req.params.leaderId , {
            $set: req.body  //updat e will be in body of message
        },{new :true}) //so that findbyid method return updated dish as json
        .then((leader) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
            res.json(leader); //Let the client know, what it has updated on the server
    
         }).catch((err) => next(err));
    
    })
    .delete((req,res,next) =>{
        console.log("Hello Delete")
        Leaders.findOneAndRemove(req.params.leaderId)
        .then((respp) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
            console.log("Yo YO",respp);
            res.json(respp); //Let the client know, what it has posted on the server
           }).catch((err) => next(err));
    });



//We are now exporting it 
module.exports = leaderRouter;

