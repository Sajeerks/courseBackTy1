import DataURIParser from "datauri/parser";
import path from 'path'
const getDataUri =(file: Express.Multer.File)=>{
    const parser = new DataURIParser()
    const extName = path.extname(file.originalname).toString();

    console.log({extName});
  return parser.format(extName, file.buffer);
}
  

export default getDataUri