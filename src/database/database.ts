import mongoose  from "mongoose";



  export const connectToDatabase = () =>  mongoose.connect(String(process.env.MONGO_DB_URI!)).then((data)=>{

    console.log(`Mongodb is connected with ${data.connection.host}`)
  }).catch((err)=>{
    console.log(err)
  })

