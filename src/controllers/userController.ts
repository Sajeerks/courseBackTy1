import cloudinay  from 'cloudinary';
import { NextFunction, Response, Request } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { UseSchemaMethods, userModel } from "../models/userModel";
import { sendToken } from "../utils/sendToken";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";
import { courseModel } from "../models/courseModel";
import getDataUri from "../utils/dataUri";
import { statsModel } from '../models/statusModel';
 

export const register = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
  //  console.log(req.body);
    if (!name || !email || !password) {
      return next(new ErrorHandler("please enter all fileds", 400));
    }

    let user = await userModel.findOne({ email: email });
    if (user) {
      return next(
        new ErrorHandler(`user with email address ${email} already exists`, 400)
      );
    }

     
    const file = req.file
       let fileUri=   getDataUri(file!)
  const myCloud  = await cloudinay.v2.uploader.upload(fileUri.content!)


    
    let newUser = await userModel.create({
      email,
      name,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      },
    });

    sendToken(res, newUser, "user registed successfully", 201);
  }
);

export const login = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // const file = req.file
    if (!email || !password) {
      return next(new ErrorHandler("please enter all fileds", 400));
    }
    let user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler(`emial or password not correct`, 404));
    }
    const isPasswordMatched: boolean = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("incorrent email or password", 401));
    }

    sendToken(res, user, `login as ${user.name} successfull`, 200);
  }
);

export const logout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none" as "none",
    });
    res.status(200).json({
      success: true,
      message: "logged out",
    });
  }
);

export const getLoggedInUserDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // const file = req.file

    let user = await userModel.findById(req.user._id).select("+password");

    if (!user) {
      return next(new ErrorHandler(`emial or password not correct`, 404));
    }

    res.status(200).json({
      user,
      success: true,
    });
  }
);

export const changePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("please enter all fileds", 400));
    }

    let user = await userModel.findById(req.user._id).select("+password");

    if (!user) {
      return next(new ErrorHandler(`emial or password not correct`, 404));
    }
    const isPasswordMatched: boolean = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("incorrent email or password", 400));
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      user,
      success: true,
      message: "new password changed successfully",
    });
  }
);



export const updateUserProfile= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email ,createdAt } = req.body;

       
    const file = req.file
    console.log("req.file---in backednd", file);
    

   

    let user = await userModel.findById(req.user._id).select("+password");

    if (!user) {
      return next(new ErrorHandler(`emial or password not correct`, 404));
    }

   if(name){
    user.name = name
   }
   if(email){
    user.email = email
   }

   if(createdAt){
    user.createdAt = createdAt
   }

let myCloud: cloudinay.UploadApiResponse
  if(file){
    let fileUri=   getDataUri(file!)
    // console.log("fileUri==",fileUri);

     myCloud  = await cloudinay.v2.uploader.upload(fileUri.content!)
  
     
     await cloudinay.v2.uploader.destroy(user.avatar?.public_id!)
    //  .then(res=>{
    //   console.log(`aftering delting the avatar image of user res is ===  ${res}`);
    //  })
    
     console.log("myCloud.secure_urlsssss==",myCloud.secure_url);
     user.avatar.public_id =   myCloud.public_id
     user.avatar.url = myCloud.secure_url
     console.log("myCloud.secure_url==",myCloud.secure_url);
   
  }

  console.log("user.avatar?.url----before saving==",user.avatar?.url);

    await user.save();
console.log("user saved ");
console.log("user.avatar?.url----after saving==",user.avatar?.url);
    res.status(200).json({
      user,
      success: true,
      message: "user data  changed successfully now",
    });
  }
);




export const updateUserProfileByAdmin= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email ,createdAt } = req.body;

    let user = await userModel.findById(req.params.id).select("+password");
    
    if (!user) {
      return next(new ErrorHandler(` user with di ${req.params.id} is not found`, 404));
    }

       
    const file = req.file
    console.log("req.file---in backednd", file);
    

   




   if(name){
    user.name = name
   }
   if(email){
    user.email = email
   }

   if(createdAt){
    user.createdAt = createdAt
   }

let myCloud: cloudinay.UploadApiResponse
  if(file){
    let fileUri=   getDataUri(file!)
    // console.log("fileUri==",fileUri);

     myCloud  = await cloudinay.v2.uploader.upload(fileUri.content!)
  
     
     await cloudinay.v2.uploader.destroy(user.avatar?.public_id!)
    //  .then(res=>{
    //   console.log(`aftering delting the avatar image of user res is ===  ${res}`);
    //  })
    
     console.log("myCloud.secure_urlsssss==",myCloud.secure_url);
     user.avatar.public_id =   myCloud.public_id
     user.avatar.url = myCloud.secure_url
     console.log("myCloud.secure_url==",myCloud.secure_url);
   
  }

  console.log("user.avatar?.url----before saving==",user.avatar?.url);

    await user.save();
console.log("user saved ");
console.log("user.avatar?.url----after saving==",user.avatar?.url);
    res.status(200).json({
      user,
      success: true,
      message: "user data  changed successfully now",
    });
  }
);








export const forgotPassword= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email  } = req.body;
   

    let user = await userModel.findOne({email})

    if (!user) {
      return next(new ErrorHandler(`email entered is not correct`, 404));
    }
  

    const resetToken = await user.getResetPasswordToken()
    const url = `${process.env.FRONTEND_URL}/${resetToken}`
    const message= `click on the link to reset your password , ${url} if you have not requested this please ignore`

await sendEmail(user.email, "Coursebundler password reset ", message)
 await user.save()
    

    res.status(200).json({
     
      success: true,
      message: `Reset Password token send to ${email} successfully`,
    });
  }
);


export const resetPassword= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken  } = req.params;
     const resetPasswordToken =   crypto
     .createHash("sha256")
     .update(resetToken)
     .digest("hex");

    let user = await userModel.findById({resetPasswordToken:resetPasswordToken, 
      resetPasswordExpire:{
        $gt:Date.now()
      }
    
    }).select("+password");

    if (!user) {
      return next(new ErrorHandler(`Token is invalid or expired`, 400));
    }

   user.password = req.body.password
    await user.save();

    res.status(200).json({
      user,
      success: true,
      message: "user password changed successfully",
    });
  }
);

export const addToPlaylist= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.user._id) 

  

    if (!user) {
      return next(new ErrorHandler(`user not logged in `, 404));
    }
    console.log("req.body.id",req.body.id);

    const  course = await courseModel.findById(req.body.id)
    if (!course) {
      return next(new ErrorHandler(`wrong course Id `, 404));
    }
const itemsExist = user.playlist.find((item)=>{
  if(item.course.toString() === course._id.toString() ){
    return true
  }
})
  if(itemsExist)return next(new ErrorHandler("item already exist", 409))




  

    user.playlist.push({
    course:course._id.toString(),
    poster:course.poster?.url!
   })
     
    await user.save();

    res.status(200).json({
      user,
      success: true,
      message: `course added successfully `,
    });
  }
);


export const removeFromPlaylist= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.user._id) 

  

    if (!user) {
      return next(new ErrorHandler(`emial or password not correct`, 404));
    }
 const course = await courseModel.findById(req.query.id)
    if (!course) {
      return next(new ErrorHandler(`wrong course Id `, 404));
    }



    
 
    
 const newPlaylist =    user.playlist.filter(singlePlaylist=>singlePlaylist.course.toString()!== course._id.toString())
    user.playlist =newPlaylist
    await user.save();

    res.status(200).json({
      user,
      success: true,
      message: `course deleted successfully `,
    });
  }
);


export const getAllUsers= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userModel.find()

  

    if (!users) {
      return next(new ErrorHandler(`emial or password not correct`, 404));
    }
 
    res.status(200).json({
      users,
      success: true,
      message: `all users data fetched successfully `,
    });
  }
);


export const updateUserRole= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.params.id)

  

    if (!user) {
      return next(new ErrorHandler(`emial or password not correct`, 404));
    }

    const {role} = req.body

    user.role=  role
    await user.save()
 
    res.status(200).json({
      user,
      success: true,
      message: ` users data updated successfully `,
    });
  }
);


export const deleteUser= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.params.id)

  

    if (!user) {
      return next(new ErrorHandler(`emial or password not correct`, 404));
    }
      await cloudinay.v2.uploader.destroy(user.avatar?.public_id!).then(res=>{
        console.log(`res after deleting user ==${res}`);
      })
    
    await userModel.findByIdAndDelete(req.params.id)
 
    res.status(200).json({

      success: true,
      message: ` user with id ${req.params.id} deleted successfully `,
    });
  }
);


export const getUserDetailsForAdmin= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.params.id)

  

    if (!user) {
      return next(new ErrorHandler(`emial or password not correct`, 404));
    }

    
  
 
    res.status(200).json({
         user,
      success: true,
      message: ` user with id ${req.params.id} fetched successfully `,
    });
  }
);


export const deleteMYProfile= catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.user._id)
  const userID = req.user._id
  

  
      await cloudinay.v2.uploader.destroy(req.user.avatar?.public_id!).then(res=>{
        console.log(`res after deleting  mY  user ==${res}`);
      })
    
    await userModel.findByIdAndDelete(req.user._id)

  const cookieOptions ={
   expires: new Date(Date.now()),
       httpOnly: true,
      secure : false,
      sameSite:"none" as "none"
  }
 

 
    res.status(200).cookie("token",null, cookieOptions).json({

      success: true,
      message: ` user with id ${userID} deleted successfully `,
    });
  }
);


userModel.watch().on("change" , async()=>{
  console.log("inside the watch in userconstorller");
  const stats = await statsModel.find({}).sort({createdAt:"desc"}).limit(1)
  const subscriptions = await userModel.find({"subscription.status":"active"})
  stats[0].users = await userModel.countDocuments()
  stats[0].subscription = subscriptions.length
  stats[0].createdAt = new Date(Date.now())

  await stats[0].save()
})