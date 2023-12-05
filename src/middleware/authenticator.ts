import Jwt from "jsonwebtoken"
import { catchAsyncErrors } from "./catchAsyncErrors"
import { Response, Request, NextFunction } from "express"
import ErrorHandler from "../utils/ErrorHandler"
import { userModel } from "../models/userModel"

export const isAuthenticated =catchAsyncErrors(async(req:Request, res:Response,next:NextFunction)=>{

    interface JwtPayload {
        id: string
      }
    
    const {token } = req.cookies
    if(!token){
        return next(new ErrorHandler("please login to veiw the resource", 400))
    }
  const decodedId= await Jwt.verify(token, process.env.JWT_SECRET!) as string
  req.user = await  userModel.findById(decodedId)

  next()

})