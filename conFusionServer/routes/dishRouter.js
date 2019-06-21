// Express router comes together with express we dont have to require or install it
const express = require('express');
const bodyParser = require('body-parser');

//We are requiring mongoose to use database opertions and using schema 
const mongoose = require('mongoose');
//we are requiring the data schema to be used
const Dishes = require('../models/dishes');

//This will declare dishRouter as an express router
//a mini express application
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

/*Now we would have give it a endpoint dishes but we are not giving it 
 as we will import it in index.js and will mount it */

dishRouter.route('/')

/*Actually we have created a general structure of what we have done in the index 
without express routing we are making a general structure and will export it  */
//.all is running on speified operator here '/'
 /*.all((req,res,next)=> {

    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    
    next();

}) */
 .get((req,res,next)=>{
//To retrieve or get the data we will use the below database method
    Dishes.find({})
     .then((dishes) => {
         res.StatusCode = 200;
         res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
         res.json(dishes); //It will put this in body of response message as json
    }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler  

})

.post((req,res,next)=>{

   Dishes.create(req.body)
   .then((dish) => {
        console.log('Dish Created',dish);
        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
        res.json(dish); //Let the client know, what it has posted on the server

   }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler;

})

.put((req,res,next)=>{
    //403 not supported
    res.statusCode=403;

    res.end('PUT operation does not supported on /dishes ');

})
.delete((req,res,next) =>{
   Dishes.remove({})
   .then((resp) => {
    res.StatusCode = 200;
    res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
    res.json(resp); //Let the client know, what it has posted on the server
   }).catch((err) => next(err));
})


//for endpoint dishId
dishRouter.route('/:dishId')

/*Actually we have created a general structure of what we have done in the index 
without express routing we are making a general structure and will export it  */
//.all is running on speified operator here '/'
/*.all((req,res,next)=> {

    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    
    next();

}) */
 .get((req,res,next)=>{

    Dishes.findById(req.params.dishId) //This method is in Mongodb driver and mongoose too
    .then((dish) => {
         res.StatusCode = 200;
         res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
         res.json(dish); //Let the client know, what it has posted on the server
 
    }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler;
 

})

.post((req,res,next)=>{
        //403 not supported
    res.statusCode=403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
    
})

.put((req,res,next)=>{
    
    Dishes.findByIdAndUpdate(req.params.dishId , {
        $set: req.body  //updat e will be in body of message
    },{new :true}) //so that findbyid method return updated dish as json
    .then((dish) => {
        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
        res.json(dish); //Let the client know, what it has updated on the server

     }).catch((err) => next(err));

})
.delete((req,res,next) =>{
    Dishes.findOneAndRemove(req.params.dishId)
    .then((respp) => {
        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
        res.json(respp); //Let the client know, what it has posted on the server
       }).catch((err) => next(err));
});

/** *************This Code written below is to hadnle comments************************************** */

dishRouter.route('/:dishId/comments')

/*Actually we have created a general structure of what we have done in the index 
without express routing we are making a general structure and will export it  */
//.all is running on speified operator here '/'
 /*.all((req,res,next)=> {

    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    
    next();

}) */
 .get((req,res,next)=>{
//To retrieve or get the data we will use the below database method
    Dishes.findById(req.params.dishId)
     .then((dishes) => {
         if (dishes!=null)  {

         res.StatusCode = 200;
         res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
         res.json(dishes.comments); //It will put this in body of response message as json
         }
         else{
             err =new Error('Dish' + req.params.dishId+ 'Not Found')
             err.status = 404;
             return next(err); //this loc will send the error to error handler present in app.js 
         }
             }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler  
})

.post((req,res,next)=>{

   Dishes.findById(req.params.dishId)
   .then((dish) => {
    if (dish!=null)  {

        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
        dish.comments.push(req.body)
        dish.save()
        .then ((dish ) => {

        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
        res.json(dish.comments);

        }).catch((err) => next(err));    
    }
        else{
            err =new Error('Dish' + req.params.dishId+ 'Not Found')
            err.status = 404;
            return next(err); //this loc will send the error to error handler present in app.js 
        }
   }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler;

})

.put((req,res,next)=>{
    //403 not supported
    res.statusCode=403;

    res.end('PUT operation does not supported on /dishes/ ' + req.params.dishId + '/comments');

})
.delete((req,res,next) =>{
    Dishes.findById(req.params.dishId)
   .then((dish) => {
    if (dish!=null)  {

        for (var i= (dish.comments.length -1); i>=0 ; i--)
        {
            dish.comments.id(dish.comments[i]._id).remove(); //deleting sub document and deleting all comments
        }
        dish.save()
        .then ((dish ) => {

        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
        res.json(dish.comments);
        },(err) => next(err));
        
    }
    else{
        err =new Error('Dish' + req.params.dishId+ 'Not Found')
        err.status = 404;
        return next(err); //this loc will send the error to error handler present in app.js 
    }
   }).catch((err) => next(err));
})


//for endpoint dishId
dishRouter.route('/:dishId/comments/:commentId')

/*Actually we have created a general structure of what we have done in the index 
without express routing we are making a general structure and will export it  */
//.all is running on speified operator here '/'
/*.all((req,res,next)=> {

    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    
    next();

}) */
 .get((req,res,next)=>{

    Dishes.findById(req.params.dishId) //This method is in Mongodb driver and mongoose too
    .then((dish) => {
        if (dish!=null && dish.comments.id(req.params.commentId )!=null)  //Dish should be present and the comment to be deleted, both have to be checked
        {

            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
            res.json(dish.comments.id(req.params.commentId )); //It will put this in body of response message as json
            }
            else if (dish == null){
                err =new Error('Dish' + req.params.dishId+ 'Not Found')
                err.status = 404;
                return next(err); //this loc will send the error to error handler present in app.js 
            }
            else{

                err =new Error('Comment' + req.params.commentId+ 'Not Found')
                err.status = 404;
                return next(err);

            }
         
    }).catch((err) => next(err)); //The error is passed through next and then it will be handled by error handler;
 

})

.post((req,res,next)=>{
        //403 not supported
    res.statusCode=403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
    
})

.put((req,res,next)=>{
    
    Dishes.findById(req.params.dishId) //This method is in Mongodb driver and mongoose too
    .then((dish) => {
        if (dish!=null && dish.comments.id(req.params.commentId )!=null)  //Dish should be present and the comment to be deleted, both have to be checked
        {
            if(req.body.rating) {
                console.log("Hello rating");
                dish.comments.id(req.params.commentId).rating = req.body.rating;
                console.log("rating",req.body.rating);

            }
            if (req.body.comment) {

                console.log("Hello comment");

                dish.comments.id(req.params.commentId).comment = req.body.comment;

                console.log("comment",req.body.comment);

            }
            dish.save()
            .then((dish) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
            res.json(dish);  //It will put this in body of response message as json
            }).catch((err) => next(err) );
        }
            else if (dish == null)
            {
                err =new Error('Dish' + req.params.dishId+ 'Not Found');
                err.status = 404;
                return next(err); //this loc will send the error to error handler present in app.js 
            }
            else{

                err =new Error('Comment' + req.params.commentId+ 'Not Found');
                err.status = 404;
                return next(err);

            }
        
    }).catch((err) => next(err));
})
.delete((req,res,next) =>{
    Dishes.findById(req.params.dishId)
   .then((dish) => {
        if (dish!=null && dish.comments.id(req.params.commentId )!=null)  
        {

            dish.comments.id(req.params.commentId).remove(); //deleting sub document and deleting all comments
        
            dish.save()
            .then ((dish ) => {
                res.StatusCode = 200;
                res.setHeader('Content-Type','application/json'); //As we will retun a json document we have written application/json
                res.json(dish.comments);
               },(err) => next(err));
        
       }
       else if (dish == null)
       {
           err =new Error('Dish' + req.params.dishId+ 'Not Found');
           err.status = 404;
           return next(err); //this loc will send the error to error handler present in app.js 
       }
        else {
               err =new Error('Dish' + req.params.dishId+ 'Not Found')
               err.status = 404;
               return next(err); //this loc will send the error to error handler present in app.js 
            }
    }).catch((err) => next(err));
});




//We are now exporting it 
module.exports = dishRouter;