import { Router } from "express"; 
import { isUserValid } from "./controller";

const router: Router = Router(); 
 
// Registering all the module routes here
router.post("", isUserValid);
 
export default router; 
