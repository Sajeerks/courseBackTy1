class ErrorHandler extends Error{

    statusCode:number = 400
   constructor(message:string,statusCode:number){
    super(message)
    this.statusCode = statusCode 
    Error.captureStackTrace(this,this.constructor)
  
    
   }
}

export default ErrorHandler