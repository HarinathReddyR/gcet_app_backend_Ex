import { Response, Request, NextFunction, query } from "express";
import * as logger from "../services/logger";
import { isAnyUndefined, responses } from "../services/common";
import dbQuery from "../services/db";
import fs from "fs";
import { profile } from "../interfaces/profile";
import { rootCertificates } from "tls";
import { userBookList } from "../interfaces/library";
import path from "path";


export async function freshBooks(req: Request, res: Response) {
    const rollNo = req.query.rollNo as string;
    logger.log("info", `request for freshBooks`);
    if (isAnyUndefined(rollNo)) {
        res.status(400).json(responses.NotAllParamsGiven);
        return;
    }
    try{
        res.status(200).json([{
            "title" :"IOT",
            "author" : "Harinath",
            "imageUrl" : "lib/assets/textbook1.png"
        },
        {
           "title" :"daa",
            "author" : "Harinath",
            "imageUrl" : "lib/assets/test.png"
        },
        {
            "title" :"ai",
            "author" : "abji",
            "imageUrl" : "lib/assets/textbook1.png"
        },
        {
           "title" :"abhiT",
            "author" : "abhi",
            "imageUrl" : "lib/assets/textbook1.png"
        },
        {
            "title" :"abhiT",
             "author" : "abhi",
             "imageUrl" : "lib/assets/textbook1.png"
         },
    ]);
    }catch  (err) {
        logger.log("error", err);
        res.json(responses.ErrorWhileDBRequest);
    }
    
}

export async function readList(req: Request,res : Response) {
    const rollNo = req.query.rollNo as string;
    logger.log("info", `request for MyList`);
    if (isAnyUndefined(rollNo)) {
        res.status(400).json(responses.NotAllParamsGiven);
        return;
    }
    try{
        let bookList = (await dbQuery(
            `select Bookid from printSupply where rollNo = '${rollNo}'`
          )) as string[];
        res.status(200).json({ bookList });
    }catch (err) {
        logger.log("error", err);
        res.json(responses.ErrorWhileDBRequest);
    }

}
export async function toggleList(req: Request, res: Response) {
    //don't forget to delete variable in db
    //max_connections and @toggle;
    const rollNo = req.query.rollNo as string;
    const BookId = req.query.BookId  as string;
    logger.log("info", `request for toogleList`);
    if (isAnyUndefined(rollNo,BookId)) {
        res.status(400).json(responses.NotAllParamsGiven);
        return;
    }
    try{
        let temp = await dbQuery(`select * from userBookList WHERE userId ='${rollNo}' and bookId='${BookId}'`) as userBookList[];
        console.log(temp);
        if(temp.length==0){
            await dbQuery(`replace into userBookList VALUES ('${BookId}','${rollNo}') `);
            res.status(200).send({ done: true });
            return;
       }else{
            await dbQuery(`delete from userBookList  WHERE userId ='${rollNo}' and bookId='${BookId}'`);
            res.status(200).send({ done: true });
            return;
       }
       //res.send({ done: false });
    }catch  (err) {
        logger.log("error", err);
        res.json(responses.ErrorWhileDBRequest);
    }
}

export async function newBook(req:Request,res:Response) {
    const rollNo =  req.query.rollNo as string;
    const {title,author,about} = req.body;   
    const pdfs = req.files as Express.Multer.File[];
    console.log(req.body)
    if (isAnyUndefined(rollNo,title,author,about)) {
        console.log(rollNo,title,author,about);
        res.status(400).json(responses.NotAllParamsGiven);
        return;
    }
    if (pdfs === undefined) {
        res.status(500).json({ "error": "No pdf selected" });
        return;
    }
    const filePath = pdfs.map(File => File.path);
    try{
        await dbQuery(
            'INSERT INTO books  (bookId,Title,author,path,about,size) VALUES (?, ?, ?, ?, ?, ?)',
            ["3", title, author ,filePath,about,2]
          );
          res.status(200).json({"ok":'k'});
    }catch{
        filePath.forEach(filePath => {
            fs.unlinkSync(filePath);
        });
        logger.log("error", "Error in DB");
        res.status(500).json({ "done": false })
    }
    
}