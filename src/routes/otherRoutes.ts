import express from "express";

import {  authorizedRoles, isAuthenticated } from "../middleware/authenticator";
import { contact, courseRequest, getDashBoardStats } from "../controllers/otherConroller";

const otherRouter = express.Router();

otherRouter.route("/contact").post(contact)
otherRouter.route("/courseRequest").post(courseRequest)
otherRouter.route("/admin/stats").get(isAuthenticated,authorizedRoles("admin"),getDashBoardStats )

  
export default otherRouter;
