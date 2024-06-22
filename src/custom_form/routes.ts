import { Router } from "express"; 
import { submitForm } from "./controller";
import defineStorage from "../services/upload";

const router: Router = Router(); 
 
// Registering all the module routes here

router.post("/submit", submitForm);
 
export default router; 