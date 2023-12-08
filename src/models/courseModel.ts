import mongoose, { InferSchemaType } from "mongoose";


interface CousseModelType{
  _id?:string
  title:string,
  description:string,
  lectures:{
    _id?:string
    title: string;
    description: string;
    video?: {
        public_id: string;
        url: string;
    }
  }[] 

  poster?: {
    public_id: string;
    url: string;
} | null | undefined
views:number
numOfVideos:number
category:string
createdBy:string
createdAt:Date



}


const courseSchema = new mongoose.Schema<CousseModelType>({
    title: {
      type: String,
      required: [true, "Please enter course title"],
      minLength: [4, "Title must be at least 4 characters"],
      maxLength: [80, "Title can't exceed 80 characters"],
    },
    description: {
      type: String,
      required: [true, "Please enter course title"],
      minLength: [20, "Title must be at least 20 characters"],
    },
  
    lectures: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        video: {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      },
    ],
  
    poster: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    numOfVideos: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: [true, "Enter Course Creator Name"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });


  type COurseTyle = InferSchemaType<typeof courseSchema>;





export const courseModel = mongoose.model("courseModel", courseSchema);
