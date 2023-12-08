import  cloudinay from 'cloudinary';
import { NextFunction, Response, Request } from 'express';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import { sendEmail } from '../utils/sendEmail';


export const contact =catchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
  const {name, email, message} = req.body
  
  const to = process.env.MY_MAIL!
  const subject = 'Contact from coursebundleer'
  const text = `I am ${name} and my email is ${email} and my message \n
  is ${message}`


  await sendEmail(to, subject, text)


    res.status(200).json({
        success:true,
        message:`contact form submitted successfuly`
    })
})


export const courseRequest =catchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    const {name, email, course} = req.body
  
    const to = process.env.MY_MAIL!
    const subject = 'Contact from coursebundleer'
    const text = `I am ${name} and my email is ${email} and my message \n
    is ${course}`
  
  
    await sendEmail(to, subject, text)

    res.status(200).json({
        success:true,
        message:`courseRequest form submitted successfuly`
    })
})


export const getDashBoardStats =catchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{


    res.status(200).json({
        success:true,
        message:`courseRequest form submitted successfuly`
    })
})