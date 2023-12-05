import { Response, Request,NextFunction } from "express";

export const catchAsyncErrors =(passedFunction:any)=>(req:Request, res:Response,next:NextFunction)=>{
    Promise.resolve(passedFunction(req, res, next)).catch(next)

}