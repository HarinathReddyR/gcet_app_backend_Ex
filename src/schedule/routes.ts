import { Router } from "express"; 
import { dailyschedule } from "./controller";

const router: Router = Router(); 
 
// Registering all the module routes here
router.get("",dailyschedule);
 
export default router; 