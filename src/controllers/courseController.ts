import { NextFunction, Response, Request } from 'express';
import { courseModel } from '../models/courseModel';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';


export const getAllCourses = catchAsyncErrors( async(req:Request, res:Response, next:NextFunction)=>{
    

    const allCourses = await courseModel.find().select("-lectures")
    // const allCourses ="sssssssssssssssssssss"
    // console.log({allCourses});
    res.status(200).json({
        success:true,
        allCourses, 
        message:" All products send successfully"
    })
})


export const createNewCourse = catchAsyncErrors( async(req:Request, res:Response, next:NextFunction)=>{
   const {title, description, category, createdBy} = req.body 
   if(!title ||  !description || !category || !createdBy){
    return next(new ErrorHandler("please add all fields" , 404))
   }
     
//    const file = req.file
    
   
   
    const newCourse = await courseModel.create( {
        title, description, category, createdBy,
        poster:{
            public_id :"temp public id ",
            url:"temp url"
        }

    })
        // const allCourses ="sssssssssssssssssssss"
    // console.log({allCourses});
    res.status(201).json({
        success:true,
        newCourse, 
        message:" course created  successfully  you can add lectures now"
    })
})