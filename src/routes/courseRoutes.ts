import express from "express";
import {
  addLecture,
  createNewCourse,
  deleteCourse,
  deleteSingleLecture,
  getAllCourses,
  getLectureDetails,
} from "../controllers/courseController";
import singleUpload from "../middleware/mutler";
import { authorizeSubscribers, authorizedRoles, isAuthenticated } from "../middleware/authenticator";

const courseRouter = express.Router();

courseRouter.route("/allcourses").get(getAllCourses);
courseRouter.route("/createcourse").post(singleUpload, createNewCourse);

courseRouter
  .route("/course/:id")
  .get(isAuthenticated, authorizeSubscribers,getLectureDetails)
  .post(isAuthenticated, authorizedRoles("admin"), singleUpload, addLecture)
  .delete(isAuthenticated, authorizedRoles("admin") ,deleteCourse)

  courseRouter.route("/deleteSingleLecture").put(isAuthenticated, deleteSingleLecture)


  
export default courseRouter;
