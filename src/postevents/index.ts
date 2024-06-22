import { Router } from "express"; 
import eventsRouter from "./routes";
const router = Router(); 
 
// Defining the core path from which this module should be accessed

router.use("/events", eventsRouter);
 
export default router;  
