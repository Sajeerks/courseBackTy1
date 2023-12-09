import  cloudinay from 'cloudinary';
import { NextFunction, Response, Request } from 'express';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import { sendEmail } from '../utils/sendEmail';
import { statsModel } from '../models/statusModel';


export const contact =catchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
  const {name, email, message} = req.body

  if(!name ||  !email || !message){
    return next (new ErrorHandler("please enter all fields", 400))

  }
  
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

    if(!name ||  !email || !course){
        return next (new ErrorHandler("please enter all fields", 400))
    
      }
  
    const to = process.env.MY_MAIL!
    const subject = 'Request course from coursebundleer'
    const text = `I am ${name} and my email is ${email} and my message \n
    is ${course}`
  
  
    await sendEmail(to, subject, text)

    res.status(200).json({
        success:true,
        message:`courseRequest form submitted successfuly`
    })
})


export const getDashBoardStats =catchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{

    const stats = await statsModel.find({}).sort({createdAt:"desc"}).limit(12)

    const statsData =[ ]
   const requiredSize = 12- stats.length 
   for (let i = 0; i < stats.length; i++) {
      statsData.unshift(stats[i])
    
   }   
   for (let i = 0; i < requiredSize; i++) {
    statsData.unshift({
      users:0,
      subscription:0,
      views:0
    })
  
 }   
 const usersCount = statsData[11].users
 const viewsCount = statsData[11].views
 const subscriptionsCount = statsData[11].subscription


 let userPercentage = 0, viewsPercentage = 0, subscriptionsPercentage = 0
 let userProfit= true, viewsProfit = true, subscriptionsProfit = true
 if(statsData[10].users === 0) userPercentage = usersCount *100
 if(statsData[10].views === 0) viewsPercentage = viewsCount *100
 if(statsData[10].subscription === 0) subscriptionsPercentage = subscriptionsCount *100
 else{
  const differnce = {
    users:statsData[11].users -statsData[10].users,
    views:statsData[11].views -statsData[10].views,
    subscription:statsData[11].subscription -statsData[10].subscription,
  }
 userPercentage = (differnce.users/statsData[10].users) *100
 viewsPercentage = (differnce.views/statsData[10].views) *100
 subscriptionsPercentage = (differnce.subscription/statsData[10].subscription) *100
 if(userPercentage < 0) userProfit = false
 if(viewsPercentage < 0) viewsProfit = false
 if(subscriptionsPercentage < 0) subscriptionsProfit = false



 }






    res.status(200).json({
        success:true,
         stats:statsData,
         usersCount,
         viewsCount,
         subscriptionsCount,
          userPercentage, viewsPercentage , subscriptionsPercentage ,
          userProfit,  viewsProfit , subscriptionsProfit 
    })
})