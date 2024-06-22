import { Response, Request } from "express";
import fs from "fs";
import dbQuery from "../services/db";
import * as logger from "../services/logger";


export async function postEvents(req: Request, res: Response) {
    const { title, description, date, venue } = req.body;
    const usr: string = "admin"; // <= TODO 
    const imgs = req.files as Express.Multer.File[];
    if (imgs === undefined) {
        res.status(500).json({ "error": "No images selected" });
        return;
    }
    
    const filePaths = imgs.map(img => img.path);
    try {
        // TODO DB table update I think...
        for (const filePath of filePaths) {
            await dbQuery(
              'INSERT INTO events  (usr, title, date, venue, descr, imgPath) VALUES (?, ?, ?, ?, ?, ?)',
              [usr, title, date, venue, description, filePath]
            );
        }
        res.status(200).json({ "done": true });
    } catch {
        filePaths.forEach(filePath => {
            fs.unlinkSync(filePath);
        });
        logger.log("error", "Error in DB");
        res.status(500).json({ "done": false });
    }
} 
