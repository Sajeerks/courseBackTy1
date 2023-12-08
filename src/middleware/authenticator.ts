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





export const authorizedRoles =(...roles:string[])=>{


return  ((req:Request, res:Response,next:NextFunction)=>{
  if(!roles.includes(req.user.role)){
    return next(new ErrorHandler(`user with role ${req.user.role} is not allowed to view this resource`, 400))
  }
next()
})
 

}

export const authorizeSubscribers =(req:Request, res:Response,next:NextFunction)=>{
  if(req.user.subscription.status !== "active"  && req.user.role !=="admin"){
    return next(new ErrorHandler("Only subscribers can access this message", 403))
  }
  next()
}




// export const authoizedRoles =(...roles:string[]) =>(req:Request, res:Response,next:NextFunction)=>{

//   if(!roles.includes(req.user.role)){
//     return next(new ErrorHandler(`user with role ${req.user.role} is not allowed to view this resource`, 400))
//   }
// next()

// }