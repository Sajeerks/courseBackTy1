import mongoose, { Model } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";


export interface UserTypeForCretaingSchema   {
    name: string;
    email: string;
    password: string;
    role: string;
    subscription:{
      id:string | undefined
      status:string | undefined
    }

    resetPasswordExpire?: Date | undefined;
    resetPasswordToken?: string | undefined;
    avatar?: {
        public_id: string;
        url: string;
    } | undefined;
   

    playlist:{
      course:string, 
      poster:string

    }[]

  
}

export interface UseSchemaMethods {
    getJWTToken(): string,
    comparePassword(enteredPassword :string):Promise<boolean>
    getResetPasswordToken():string,
  }


  export type UserModeType = Model<UserTypeForCretaingSchema, {}, UseSchemaMethods>;


const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
      },
      email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: validator.isEmail,
      },
    
      password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false,
      },
      role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },
    
      subscription: {
        id: String,
        status: String,
      },
    
      avatar: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    
      playlist: [
        {
          course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courseModel",
          },
          poster: String,
        },
      ],
    
      createdAt: {
        type: Date,
        default: Date.now,
      },
    
      resetPasswordToken: String,
      resetPasswordExpire: String,

})
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, {
      expiresIn: "15d",
    });
  };
  userSchema.methods.comparePassword = async function (password:string) {
    return await bcrypt.compare(password, this.password);
  };


  
  userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };
  

export const userModel = mongoose.model<UserTypeForCretaingSchema, UserModeType>("userModel", userSchema);
