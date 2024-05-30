import { Response, Request, NextFunction, query } from "express";
import * as logger from "../services/logger";
import { isAnyUndefined, responses } from "../services/common";
import dbQuery from "../services/db";
import { profile } from "../interfaces/profile";


export async function profile(req: Request, res: Response) {
    const rollNo = req.query.rollNo as string;
    logger.log("info", `request for dailyschedule`);
    if (isAnyUndefined(rollNo)) {
        res.status(400).json(responses.NotAllParamsGiven);
        return;
    }
    try{
        const result = (await dbQuery(
            `SELECT * FROM student WHERE rollNo = '${rollNo}' ;`
        )) as profile;
        console.log(result.lastName);
    }catch  (err) {
        logger.log("error", err);
        res.json(responses.ErrorWhileDBRequest);
    }
    
}