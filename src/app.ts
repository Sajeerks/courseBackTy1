import express from "express";
 const app =express()
import { NextFunction, Response, Request } from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from "cookie-parser"
import fileUpload  from "express-fileupload" 
import  errorMiddleware  from "./middleware/errorMiddleware";

app.use(fileUpload())

app.use(express.json())
app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(cookieParser())
  // app.use(cors({
  //   origin: process.env.FRONTEND_URL!,

  //   credentials: true,
  //   // methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  // }))

import courseRouter from "./routes/courseRoutes"; 
import userRouter from "./routes/userRoutes";

  


  app.use("/api/v1",courseRouter )
  app.use("/api/v1",userRouter )



  app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
  )
);




app.use(errorMiddleware)
export default app