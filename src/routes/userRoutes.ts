import express from "express"
import { login, logout, register,getLoggedInUserDetails, changePassword, updateUserProfile, forgotPassword, resetPassword, addToPlaylist, removeFromPlaylist } from "../controllers/userController"
import { authorizedRoles, isAuthenticated } from "../middleware/authenticator"
import { addLecture } from "../controllers/courseController"
const userRouter = express.Router()


userRouter.route("/register").post(register)
userRouter.route("/logout").get(logout)
userRouter.route("/login").post(login)
userRouter.route("/me").get(isAuthenticated, getLoggedInUserDetails)
userRouter.route("/changepassword").put(isAuthenticated, changePassword)
userRouter.route("/updateprofile").put(isAuthenticated, updateUserProfile)
userRouter.route("/forgotPassword").put(forgotPassword)
userRouter.route("/resetPassword/resetToken").put(resetPassword)
userRouter.route("/addtoplaylist").post(isAuthenticated,authorizedRoles("admin"),addToPlaylist)
userRouter.route("/removefromPlaylist").delete(isAuthenticated,removeFromPlaylist)
















export default userRouter
