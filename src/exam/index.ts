import { Router } from "express"; 
import ExamRouter from "./routes";

const router = Router(); 
 
// Defining the core path from which this module should be accessed 
router.use("/login", ExamRouter)
export default router;  
