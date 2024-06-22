import { Router } from "express"; 
import { postEvents } from "./controller";
import defineStorage from "../services/upload";

const router: Router = Router(); 
 
// Registering all the module routes here

router.post("", defineStorage('public/posts/').array('images'), postEvents);
 
export default router; 