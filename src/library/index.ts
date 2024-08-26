import { Router } from "express"; 
import LibraryRouter from "./routes";
const router = Router(); 
 
// Defining the core path from which this module should be accessed

router.use("/library", LibraryRouter);
 
export default router;  