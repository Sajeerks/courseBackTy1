import { NextFunction, Response, Request } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { UseSchemaMethods, userModel } from "../models/userModel";
import { sendToken } from "../utils/sendToken";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";
import { courseModel } from "../models/courseModel";
 

export const register = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    // const file = req.file
    if (!name || !email || !password) {
      return next(new ErrorHandler("please enter all fileds", 400));
    }

    let user = await userModel.findOne({ email: email });
    if (user) {
      return next(
        new ErrorHandler(`user with email address ${email} already exists`, 400)
      );
    }
    let newUser = await userModel.create({
      email,
      name,
      password,
      avatar: {
        public_id: "sample publi id",
        url: "https://plus.unsplash.com/premium_photo-1680740103993-21639956f3f0?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      secure: false,
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
    const { name, email  } = req.body;
   

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
    await user.save();

    res.status(200).json({
      user,
      success: true,
      message: "user data  changed successfully",
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
