import express from "express"
import { login, logout, register,getLoggedInUserDetails } from "../controllers/userController"
import { isAuthenticated } from "../middleware/authenticator"
const userRouter = express.Router()


userRouter.route("/register").post(register)
userRouter.route("/logout").get(logout)
userRouter.route("/login").post(login)
userRouter.route("/me").get(isAuthenticated, getLoggedInUserDetails)








export default userRouter
