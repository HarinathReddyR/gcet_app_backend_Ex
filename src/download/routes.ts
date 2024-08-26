
import { Router } from "express"; 
import { download } from "./controller";



const router: Router = Router(); 

router.get("/Textbooks",download);
 
// Registering all the module routes here

 
export default router; 