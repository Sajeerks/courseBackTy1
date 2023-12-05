import { NextFunction, Response, Request } from 'express';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import { UseSchemaMethods, userModel } from '../models/userModel';
import { sendToken } from '../utils/sendToken';

export const register = catchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    const {name, email , password} = req.body
    // const file = req.file
    if(!name || !email || !password){
        return next(new ErrorHandler("please enter all fileds", 400))
    }

    let user = await userModel.findOne({email:email})
    if(!user){
        return next(new ErrorHandler(`user with email address ${email} already exists`, 400))

    }
    let newUser = await userModel.create({email, name, password, 
    avatar:{
        public_id:"sample publi id", 
        url:"https://plus.unsplash.com/premium_photo-1680740103993-21639956f3f0?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
    })


sendToken(res, newUser, "user registed successfully"  ,201  )
  
    
})

export const login = catchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    const { email , password} = req.body
    // const file = req.file
    if(!email || !password){
        return next(new ErrorHandler("please enter all fileds", 400))
    }
  let user = await userModel.findOne({email}).select("+password")
  
  if(!user){
    return next(new ErrorHandler(`emial or password not correct`, 404))

}
 const isPasswordMatched:boolean =  await user.comparePassword(password)
  
 if (!isPasswordMatched) {
    return next(new ErrorHandler("incorrent email or password", 401));
  }

  sendToken(res, user, `login as ${user.name} successfull`, 200);
    
})


export const logout = catchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
  
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure : false,
        sameSite:"none" as "none"
  
      });
      res.status(200).json({
        success: true,
        message: "logged out",
      });
    
  
    
})



export const getLoggedInUserDetails = catchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
   
    // const file = req.file
  
  let user = await userModel.findById(req.user._id).select("+password")
  
  if(!user){
    return next(new ErrorHandler(`emial or password not correct`, 404))

}

  

res.status(200).json({
    user,
    success:true
})

    
})