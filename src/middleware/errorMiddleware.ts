import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

 const errorMiddleware =(err:Error, req:Request, res:Response, next:NextFunction):void=>{
 
    if(err.name === "CastError"){
        const message =  `Resource not found Invalid , ${err}`
        err = new ErrorHandler(message, 400)
     }
 
     // Mongoose duplicate key error
    //  if (err.code === 11000) {
    //    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    //    err = new ErrorHandler(message, 400);
    //  }
 
   // Wrong JWT error
   if (err.name === "JsonWebTokenError") {
     const message = `Json Web Token is invalid, Try again `;
     err = new ErrorHandler(message, 400);
   }
 
   // JWT EXPIRE error
   if (err.name === "TokenExpiredError") {
     const message = `Json Web Token is Expired, Try again `;
     err = new ErrorHandler(message, 400);
   }
 
 
 
   err.message = err.message || "internal server error"

 res.status(new ErrorHandler(err.message,500).statusCode ).json({
    success:false,
    error:err.stack,
    message:err.message
 })


}

export default errorMiddleware