import { Router, Request, Response, NextFunction } from "express";
import loginRouter from "./login";
import eventsRouter from "./postevents";
import customFormRouter from "./custom_form";
import { verifyToken } from "./login/controller";


const router = Router();

router.use("/", loginRouter);
// router.use(verifyToken); 
router.use("/", eventsRouter);

router.use("/", customFormRouter);
export default router;