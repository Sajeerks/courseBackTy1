import app  from "./app";
import dotenv from "dotenv"
import { connectToDatabase } from "./database/database";
dotenv.config({path:"../backend/config/config.env"})


process.on("uncaughtException", (err:Error)=>{
    console.log(`Error :${err.message}`)
    console.log(`shutting down server due to unhandled uncaughtException`)
    process.exit(1)
  
})


connectToDatabase()


const server = app.listen(process.env.PORT, ()=>{
    console.log(`app is listenting on port ==${process.env.PORT}`);
})

process.on("unhandledRejection", (err:Error)=>{
    console.log(`err : ${err.message}`);
    console.log(`shutting down server due to unhandled rejection`);

})