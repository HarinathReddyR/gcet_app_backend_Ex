import { Router, Request, Response, NextFunction } from "express";
import loginRouter from "./login";
import { verifyToken } from "./login/controller";


const router = Router();

router.use("/", loginRouter);
router.use(verifyToken); 

export default router;