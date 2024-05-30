import { Router, Request, Response, NextFunction } from "express";
import loginRouter from "./login";
import AttendanceRouter from "./attendance";
import ScheduleRouter from "./schedule";
import ProfileRouter from "./profile";
import { verifyToken } from "./login/controller";


const router = Router();

router.use("/", loginRouter);
router.use("/", ProfileRouter);
router.use("/",AttendanceRouter)
//registering schedule
router.use("/",ScheduleRouter)
router.use(verifyToken); 

export default router;