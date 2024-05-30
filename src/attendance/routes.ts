import { Router } from "express"; 
import { attendance } from "./controller";

const router: Router = Router(); 
 
// Registering all the module routes here
router.get("", attendance);
 
export default router; 
