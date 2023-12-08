import express from "express";
import { isAuthenticated } from "../middleware/authenticator";
import { buySubscription, getRazorPayKey, paymentVerification,cancelSubscription } from "../controllers/paymentController";



const paymentRouter = express.Router();

paymentRouter.route("/subscribe").get(isAuthenticated, buySubscription)
paymentRouter.route("/paymentVerificatin").get(isAuthenticated, paymentVerification)
paymentRouter.route("/getRazorPayKey").get( getRazorPayKey)
paymentRouter.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription)






  
export default paymentRouter;
