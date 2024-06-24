import { Router, Request, Response, NextFunction } from "express";
import loginRouter from "./login";
import eventsRouter from "./postevents";
import customFormRouter from "./custom_form";
import AttendanceRouter from "./attendance";
import ScheduleRouter from "./schedule";
import ProfileRouter from "./profile";
import ExamRouter from "./exam";
import { verifyToken } from "./login/controller";


const router = Router();

router.use("/", loginRouter);
// router.use(verifyToken); 
router.use("/", eventsRouter);
router.use("/", ProfileRouter);
router.use("/",AttendanceRouter)
//registering schedule
router.use("/",ScheduleRouter)
router.use("/", ExamRouter);
router.use(verifyToken); 

router.use("/", customFormRouter);
export default router;