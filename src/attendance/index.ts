import { Router } from "express"; 
import AttendanceRouter from "./routes";

const router = Router(); 
 
// Defining the core path from which this module should be accessed 
router.use("/attendance", AttendanceRouter)
export default router;  