import { Router, Request, Response, NextFunction } from "express";
import loginRouter from "./login";
import eventsRouter from "./postevents";
import AttendanceRouter from "./attendance";
import ScheduleRouter from "./schedule";
import ProfileRouter from "./profile";
import ExamRouter from "./exam";
import { verifyToken } from "./login/controller";


const router = Router();

router.use("/", loginRouter);
router.use(verifyToken);
router.use("/", eventsRouter);
router.use("/", ProfileRouter);
router.use("/",AttendanceRouter)
//registering schedule
router.use("/",ScheduleRouter)
router.use("/", ExamRouter);

export default router;