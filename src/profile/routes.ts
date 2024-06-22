import { profile } from "console";
import { Router } from "express"; 


const router: Router = Router(); 
 
// Registering all the module routes here
router.get("",profile);
 
export default router; 