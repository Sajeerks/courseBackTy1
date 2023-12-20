import  cloudinay from 'cloudinary';
import { NextFunction, Response, Request } from 'express';
import { courseModel } from '../models/courseModel';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import getDataUri from '../utils/dataUri';
import { statsModel } from '../models/statusModel';
import { ApiFeatures } from '../utils/apiFeatures';
import { nodecache } from '../app';
import _ from 'lodash'

export const getAllCourses = catchAsyncErrors( async(req:Request, res:Response, next:NextFunction)=>{
    
  const apiFeatures = new ApiFeatures(courseModel.find().select("-lectures"), req.query).search().filter()

  console.log("req.query--", req.query);

  if(_.isEqual({ page: '1' }, req.query) ){
    console.log("equal in stringfying req.query");
    nodecache.del(["allCourses", "filteredCoursesCount"])
  }



   const resultPerPage = 2 
   let allCourses :any
   let filteredCoursesCount:Number
   if(nodecache.has("allCourses")){

      allCourses = JSON.parse( nodecache.get("allCourses")!)
      filteredCoursesCount = JSON.parse( nodecache.get("filteredCoursesCount")!)

   
   }  else {

    allCourses  = await apiFeatures.query;
    filteredCoursesCount = 0;
   // const allCourses ="sssssssssssssssssssss"
   // console.log({allCourses});
   if (allCourses) {
       filteredCoursesCount = allCourses.length;
     } else {
       filteredCoursesCount = 0;
     }
     apiFeatures.pagination(resultPerPage)
 
     allCourses = await apiFeatures.query.clone(); 

     nodecache.set("allCourses",JSON.stringify(allCourses))
     nodecache.set("filteredCoursesCount",JSON.stringify(filteredCoursesCount))


   }
  


    res.status(200).json({
        success:true,
        allCourses, 
        filteredCoursesCount,
        message:" All allCourses send successfully"
    })
})


export const createNewCourse = catchAsyncErrors( async(req:Request, res:Response, next:NextFunction)=>{
   const {title, description, category, createdBy} = req.body 
//    console.log("req.body====",req.body);
   if(!title ||  !description || !category || !createdBy){
    return next(new ErrorHandler("please add all fields" , 404))
   }
     
   const file = req.file
    console.log("file----", file);

  
       let fileUri=   getDataUri(file!)
    
  const myCloud  = await cloudinay.v2.uploader.upload(fileUri.content!)
    
   
    const newCourse = await courseModel.create( {
        title, description, category, createdBy,
        poster:{
            public_id :myCloud.public_id,
            url:myCloud.secure_url
        }

    })
    nodecache.del(["allCourses", "filteredCoursesCount"])


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

export const deleteCourse = catchAsyncErrors( async(req:Request, res:Response, next:NextFunction)=>{
    

    const course = await courseModel.findById(req.params.id)

    if(!course){
        return next( new ErrorHandler("the course with given id does not exist", 404))

     
}
await cloudinay.v2.uploader.destroy( course.poster?.public_id!)
   for (let i = 0; i < course.lectures.length; i++) {
    const singleLecture = course.lectures[i]
        await cloudinay.v2.uploader.destroy(singleLecture.video?.public_id!, {
            
                resource_type: "video",
             
        }).then((res)=>{
            console.log(res);
        })
        // console.log("deleted video--",singleLecture.video?.public_id);
    
   }

await courseModel.findByIdAndDelete(req.params.id)


    res.status(200).json({
        success:true,
        message:"course deleted  successfully"
    })
})




export const deleteSingleLecture = catchAsyncErrors( async(req:Request, res:Response, next:NextFunction)=>{
    
   const {courseId , lectureId} = req.query
   if(!courseId ||  !lectureId ){
    return next(new ErrorHandler("please add all fields" , 404))
   }
    const course = await courseModel.findById(courseId)

    if(!course){
        return next( new ErrorHandler("the course with given id does not exist", 404))

     
}


    for (let i = 0; i < course.lectures.length; i++) {
        const singleLecture = course.lectures.find(item=>item._id?.toString() ===  lectureId?.toString())
            await cloudinay.v2.uploader.destroy(singleLecture?.video?.public_id!, {
                
                    resource_type: "video",
                 
            }).then((res)=>{
                console.log(res);
            })
            // console.log("deleted video--",singleLecture.video?.public_id);
        
       }


       course.lectures= course.lectures.filter(item=>item._id?.toString() !== lectureId?.toString())


 
   course.numOfVideos = course.lectures.length
       await course.save()
 


    res.status(200).json({
        success:true,
        message:`lecture with id id ${lectureId} was deleted successfully`
    })
})



courseModel.watch().on("change" , async()=>{
    console.log("inside the watch in userconstorller");
  const stats = await statsModel.find({}).sort({createdAt:"desc"}).limit(1)
    const courses = await courseModel.find({})
    let totalViews = 0 
    for (let i = 0; i < courses.length; i++) {
       totalViews += courses[i].views          
       
    }

    stats[0].views = totalViews
    stats[0].createdAt = new Date(Date.now())


  await stats[0].save()
})