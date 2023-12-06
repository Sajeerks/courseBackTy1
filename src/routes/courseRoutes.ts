import express from "express";
import { addLecture, createNewCourse, getAllCourses, getLectureDetails } from "../controllers/courseController";
import singleUpload from "../middleware/mutler";
import { authorizedRoles, isAuthenticated } from "../middleware/authenticator";


const courseRouter = express.Router()

courseRouter.route("/allcourses").get(getAllCourses)
courseRouter.route("/createcourse").post(singleUpload,createNewCourse)


courseRouter.route("/course/:id").get(getLectureDetails).post(isAuthenticated,authorizedRoles("admin"), singleUpload,addLecture)





export default courseRouter