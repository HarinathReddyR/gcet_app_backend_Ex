import { Response, Request } from "express";
import dbQuery from "../services/db";
import * as logger from "../services/logger";

export async function submitForm(req: Request, res: Response) {
    console.log(req.body);
    const { title, descr, ques } = req.body;
    for (const question of ques) {
        try {
            dbQuery(`INSERT INTO custom_form VALUES (?, ?, ?, ?, ?)`, [title, descr, question.question, question.type, question.options])
        } catch (err) {
            logger.log("error", err);
            res.status(400).json({ "success": false });
        }
    }
    res.status(200).send({ "success": true });
}
