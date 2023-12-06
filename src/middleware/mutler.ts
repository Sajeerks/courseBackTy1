import multer from "multer";

const storage = multer.memoryStorage()
// limits: {
//     fileSize: 10 * 1024 * 1024, // No larger than 10mb
//     fieldSize: 10 * 1024 * 1024, // No larger than 10mb
// }

const singleUpload = multer({storage}).single("file")
// const singleUpload = multer({storage}).none()



export default singleUpload