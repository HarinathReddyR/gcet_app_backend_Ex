import { Response, Request, NextFunction, query } from "express";
import * as logger from "../services/logger";
import { isAnyUndefined, responses } from "../services/common";
import dbQuery from "../services/db";
import dayjs from "dayjs";
import { timeTable,periods, subjects, facultyName} from "../interfaces/schedule";

export async function dailyschedule(req: Request, res: Response) {
    const rollNo = req.query.rollNo as string;
    const date =req.query.date as string;
    //console.log(rollNo,date)
    logger.log("info", `request for dailyschedule`);
    if (isAnyUndefined(rollNo,date)) {
        res.status(400).json(responses.NotAllParamsGiven);
        return;
    }
    try{
        var dateobj = new Date(date);
        const result = (await dbQuery(
            `SELECT * FROM studentSpecificSchedule WHERE rollNo = '${rollNo}' and date='${dayjs().format("DD-MM-YY")}' ;`
        )) as any;
        if(result.length==0){
            const specialSchedules = (await dbQuery(
              `SELECT * FROM special_Schedule WHERE date='${dayjs().format("DD-MM-YY")}' ;`
          )) as any;
          const specialMap = new Map<string, periods>();
            specialSchedules.forEach((schedule: any) => {
                const key = `${schedule.fromTime}-${schedule.toTime}`;
                //check once
                specialMap.set(key, {
                    fromTime: schedule.fromTime,
                    toTime: schedule.toTime,
                    subName: schedule.subName,
                    subid : schedule.subid,
                    fid :schedule.fid,
                    facultyName: schedule.facultyName
                });
            });
          //CHECK SCHEDULE IN SPEACIAL
            
            const dayOfWeek: string = String.fromCharCode(dateobj.getDay()+ 48);
            const query:string = 'SELECT * FROM timeTable where branch=? AND year=? AND section=? and day=?';
            const branch:string = "CSE";
            const year :number = 3;
            const section:string = "D";
            const periodsList = (await dbQuery(query, [branch, year,section,dayOfWeek])) as timeTable[];
            // console.log(periodsList);
            let todayschedule :periods[] =new Array(periodsList.length);
            for(let i=0;i<periodsList.length;i++){
                let temp :periods={
                    fromTime:"",
                    toTime : "",
                    subName : "",
                    subid :"",
                    fid :"",
                    facultyName : ""
                };
                temp.fromTime =periodsList[i].fromTime;
                temp.toTime =periodsList[i].toTime;
                temp.subid =periodsList[i].subid;
                temp.fid = periodsList[i].fid;
                const key = `${periodsList[i].fromTime}-${periodsList[i].toTime}`;
                if (specialMap.has(key)) {
                    // Use special schedule data if available
                    const special = specialMap.get(key)!;
                    temp.subName = special.subName;
                    temp.facultyName = special.facultyName;
                } else {
                    // Fetch subject name
                    let sub = (await dbQuery(`SELECT subName FROM subjects WHERE subid = ?`, [periodsList[i].subid])) as subjects[];
                    temp.subName = sub[0].subName;
                    // Fetch faculty name
                    let tmpName = (await dbQuery(`SELECT lastName, firstName FROM faculty WHERE fid = ?`, [periodsList[i].fid])) as facultyName[];

                    temp.facultyName = tmpName[0].lastName + " " + tmpName[0].firstName;
                }
                todayschedule[i]=temp;
            }
            console.log(todayschedule);
            res.status(200).json(todayschedule);
          
        }else
            res.status(200).json({"special":true});
    }catch (err) {
        logger.log("error", err);
        res.json(responses.ErrorWhileDBRequest);
    }
}