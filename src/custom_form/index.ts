import { Router } from "express"; 
import customFormRouter from "./routes";
const router = Router(); 
 
// Defining the core path from which this module should be accessed

router.use("/custom-form", customFormRouter);
 
export default router;  