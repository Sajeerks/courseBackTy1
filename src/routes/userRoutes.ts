import express from "express"
import { login, logout, register,getLoggedInUserDetails, changePassword, updateUserProfile, forgotPassword, resetPassword } from "../controllers/userController"
import { isAuthenticated } from "../middleware/authenticator"
const userRouter = express.Router()


userRouter.route("/register").post(register)
userRouter.route("/logout").get(logout)
userRouter.route("/login").post(login)
userRouter.route("/me").get(isAuthenticated, getLoggedInUserDetails)
userRouter.route("/changepassword").put(isAuthenticated, changePassword)
userRouter.route("/updateprofile").put(isAuthenticated, updateUserProfile)
userRouter.route("/forgotPassword").put(forgotPassword)
userRouter.route("/resetPassword/resetToken").put(resetPassword)













export default userRouter
