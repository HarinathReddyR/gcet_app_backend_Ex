import { Router } from "express"; 
import DownloadRouter from "./routes";
const router = Router(); 
 
// Defining the core path from which this module should be accessed

router.use("/download", DownloadRouter);
 
export default router;  