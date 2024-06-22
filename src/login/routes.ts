import { Router } from "express"; 
import { isUserValid, sendOTP } from "./controller";

const router: Router = Router(); 
 
// Registering all the module routes here
router.post("", isUserValid);

router.get("/OTP",sendOTP);

export default router; 
