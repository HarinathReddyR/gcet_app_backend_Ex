import { Response, Request, NextFunction } from "express";

import dbQuery from "../services/db";
import * as logger from "../services/logger";

export function attendance(req: Request, res: Response) {
    const username = req.body.username as string;
    logger.log("info", `request for attendance`);
    res.status(200).json([{
            "subject" :"IOT",
            "attended" : 29,
            "total" :40
        },
        {
            "subject" :"CNS",
            "attended" : 24,
            "total" :42
        }
    ]);
}