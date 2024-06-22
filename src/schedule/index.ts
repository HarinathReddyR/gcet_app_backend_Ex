import { Router } from "express"; 
import ScheduleRouter from "./routes";

const router = Router(); 
 
// Defining the core path from which this module should be accessed 
router.use("/schedule", ScheduleRouter)

export default router;  