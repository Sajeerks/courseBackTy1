import app  from "./app";
import dotenv from "dotenv"
import { connectToDatabase } from "./database/database";
dotenv.config({path:"../backend/config/config.env"})
import cloudinay from "cloudinary"
import Razorpay  from "razorpay";


process.on("uncaughtException", (err:Error)=>{
    console.log(`Error :${err.message}`)
    console.log(`shutting down server due to unhandled uncaughtException`)
    process.exit(1)
  
})


cloudinay.v2.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

connectToDatabase()


export const instance = new Razorpay({
    key_id:process.env.RAZOR_PAY_KEY!,
    key_secret:process.env.RAZOR_PAY_SECRET!
})


const server = app.listen(process.env.PORT, ()=>{
    console.log(`app is listenting on port ==${process.env.PORT}`);
})

process.on("unhandledRejection", (err:Error)=>{
    console.log(`err : ${err.message}`);
    console.log(`shutting down server due to unhandled rejection`);

})