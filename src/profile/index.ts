import { Router } from "express"; 
import ProfileRouter from "./routes";

const router = Router(); 
 
// Defining the core path from which this module should be accessed 
router.use("/profile", ProfileRouter)

export default router; 