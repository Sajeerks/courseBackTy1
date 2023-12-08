import express from "express"
import { login, logout, register,getLoggedInUserDetails, changePassword, updateUserProfile, forgotPassword, resetPassword, addToPlaylist, removeFromPlaylist, getAllUsers, updateUserRole, deleteUser, getUserDetailsForAdmin, deleteMYProfile } from "../controllers/userController"
import { authorizedRoles, isAuthenticated } from "../middleware/authenticator"
import { addLecture } from "../controllers/courseController"
import singleUpload from "../middleware/mutler"
const userRouter = express.Router()


userRouter.route("/register").post( singleUpload,register)
userRouter.route("/logout").get(logout)
userRouter.route("/login").post(login)
userRouter.route("/me").get(isAuthenticated, getLoggedInUserDetails)
userRouter.route("/deleteMYProfile").delete(isAuthenticated, deleteMYProfile)
userRouter.route("/changepassword").put(isAuthenticated, changePassword)
userRouter.route("/updateprofile").put(isAuthenticated,singleUpload, updateUserProfile)
userRouter.route("/forgotPassword").put(forgotPassword)
userRouter.route("/resetPassword/resetToken").put(resetPassword)
userRouter.route("/addtoplaylist").post(isAuthenticated,authorizedRoles("admin"),addToPlaylist)
userRouter.route("/removefromPlaylist").delete(isAuthenticated,removeFromPlaylist)
userRouter.route("/admin/getAllUsers").get(isAuthenticated,authorizedRoles("admin"),getAllUsers)

userRouter.route("/admin/user/:id").put(isAuthenticated,authorizedRoles("admin"),updateUserRole)
.delete(isAuthenticated,authorizedRoles("admin"),deleteUser)
.get(isAuthenticated,authorizedRoles("admin"),getUserDetailsForAdmin)













export default userRouter
