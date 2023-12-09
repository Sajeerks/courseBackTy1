import { Response } from "express";
import { UseSchemaMethods, UserModeType, UserTypeForCretaingSchema } from "../models/userModel";

export const sendToken =(res:Response,user:UserTypeForCretaingSchema & UseSchemaMethods , message:string, statusCode= 200)=>{
    
 const token = user.getJWTToken()
  const options ={
    expires: new Date(
        Date.now() +Number( process.env.COOKIE_EXPIRE! )* 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure : true,
      sameSite:"none" as "none"
  
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
    message:message
  });
    
}