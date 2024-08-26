
import { Router } from "express"; 
import { freshBooks, newBook, toggleList } from "./controller";
import defineStorage from "../services/upload";


const router: Router = Router(); 
 
// Registering all the module routes here

router.get("/freshBooks",freshBooks);

router.get("/toggle",toggleList);
//route to add new book
router.post("/add",defineStorage('public/Textbooks/').array('files'),newBook); 
export default router; 