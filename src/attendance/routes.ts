import { Router } from "express"; 
import { attendance, dayattendance, markAttendance, Monthattendance, studentList, totalattendance } from "./controller";

const router: Router = Router(); 
 
// Registering all the module routes here
router.get("/subjectwise", attendance);
router.get("/total", totalattendance);
router.get("/month", Monthattendance);
router.get("/date", dayattendance);
router.get("/period", studentList);
router.post("/mark", markAttendance);
 
export default router; 
