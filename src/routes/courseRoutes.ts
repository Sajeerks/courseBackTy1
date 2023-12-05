import express from "express";
import { createNewCourse, getAllCourses } from "../controllers/courseController";


const courseRouter = express.Router()

courseRouter.route("/allcourses").get(getAllCourses)
courseRouter.route("/createcourese").post(createNewCourse)




export default courseRouter