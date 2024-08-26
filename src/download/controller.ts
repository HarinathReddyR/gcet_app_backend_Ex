import { Response, Request, NextFunction, query } from "express";
import * as logger from "../services/logger";
import { isAnyUndefined, responses } from "../services/common";
import dbQuery from "../services/db";
import { rootCertificates } from "tls";
import path from "path";


export async function download(req: Request, res: Response) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', 'textbooks', filename);
    
    res.download(filePath, (err) => {
        if (err) {
            console.error('File failed to download:', err);
            res.status(500).send('Error downloading file');
        }
    });
}