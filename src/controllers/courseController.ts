import  cloudinay from 'cloudinary';
import { NextFunction, Response, Request } from 'express';
import { courseModel } from '../models/courseModel';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import getDataUri from '../utils/dataUri';


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
//    console.log("req.body====",req.body);
   if(!title ||  !description || !category || !createdBy){
    return next(new ErrorHandler("please add all fields" , 404))
   }
     
   const file = req.file
    // console.log("file----", file);

  
       let fileUri=   getDataUri(file!)
    
  const myCloud  = await cloudinay.v2.uploader.upload(fileUri.content!)
    
   
    const newCourse = await courseModel.create( {
        title, description, category, createdBy,
        poster:{
            public_id :myCloud.public_id,
            url:myCloud.secure_url
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



export const getLectureDetails = catchAsyncErrors( async(req:Request, res:Response, next:NextFunction)=>{
    

    const course = await courseModel.findById(req.params.id)

    if(!course){
        return next( new ErrorHandler("the course with given id does not exist", 404))

     
}
   

course.views +=1

 await course.save()
    res.status(200).json({
        success:true,
        lectures:course.lectures, 
        message:"All lectures for this course send successfully"
    })
})




export const addLecture = catchAsyncErrors( async(req:Request, res:Response, next:NextFunction)=>{
      const { title, description,} = req.body

      if(!title ||  !description ){
        return next(new ErrorHandler("please add all fields" , 404))
       }

    const course = await courseModel.findById(req.params.id)

    if(!course){
        return next( new ErrorHandler("the course with given id does not exist", 404))

     
}

const file = req.file
// console.log("file----", file);


   let fileUri=   getDataUri(file!)

const myCloud  = await cloudinay.v2.uploader.upload(fileUri.content!, {
    resource_type:'video'
})



   

      


///cloudanay herer

course.lectures.push({
    title,
    description,
    video:{
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }
})

course.numOfVideos = course.lectures.length
  

 await course.save()

    res.status(200).json({
        success:true,
        message:"lecture added successfully "
    })
})