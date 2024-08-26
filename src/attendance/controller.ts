import { Response, Request, NextFunction, query } from "express";

import dbQuery from "../services/db";
import * as logger from "../services/logger";
import { StringifyOptions } from "querystring";
import { isAnyUndefined, responses } from "../services/common";
import { student } from "../interfaces/student";
import { attendance, studentPresent } from "../interfaces/attendance";

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

export function totalattendance(req: Request, res: Response) {
  const username = req.body.username as string;
  logger.log("info", `request for attendance`);
  res.status(200).json({
    "total": 20,
    "attended": 15
  }
  );
}

export function Monthattendance(req: Request, res: Response) {
    const username = req.body.username as string;
    logger.log("info", `request for Monthattendance`);
    res.status(200).json([ {
        "date": "2024-08-01T00:00:00.000Z",
        "attended": 20,
        "total": 22,
        "isHoliday":true
      },
      {
        "date": "2024-08-02T00:00:00.000Z",
        "attended": 18,
        "total": 22,
        "isHoliday":false
      },
      {
        "date": "2024-08-03T00:00:00.000Z",
        "attended": 22,
        "total": 22,
        "isHoliday":false
      },
      {
        "date": "2024-08-04T00:00:00.000Z",
        "attended": 1,
        "total": 22,
        "isHoliday":false
      },
      {
        "date": "2024-08-05T00:00:00.000Z",
        "attended": 10,
        "total": 22,
        "isHoliday":false
      },
      {
        "date": "2024-08-06T00:00:00.000Z",
        "attended": 21,
        "total": 22,
        "isHoliday":true
      },
      {
        "date": "2024-08-07T00:00:00.000Z",
        "attended": 22,
        "total": 22,
        "isHoliday":false
      },
      {
        "date": "2024-09-07T00:00:00.000Z",
        "attended": 9,
        "total": 22,
        "isHoliday":false
      }
    ]);
}
export function dayattendance(req: Request, res: Response) {
    const username = req.body.username as string;
    console.log(req.query.month)
    logger.log("info", `request for dayattendance`);
    res.status(200).json([{
            "subjectName":"123",
            "isPresent" : true,
            "facultyName" :"abhi"
        },
        {
            "subjectName":"123",
            "isPresent" : false,
            "facultyName" :"abhi"
        },
        {
            "subjectName":"123",
            "isPresent" : true,
            "facultyName" :"abhi"
        },
        {
            "subjectName":"123",
            "isPresent" : true,
            "facultyName" :"abhi"
        },
        {
            "subjectName":"123",
            "isPresent" : true,
            "facultyName" :"abhi"
        },

    ]);
}

export async function studentList(req: Request, res: Response){
  console.log(req.query);
  const rollNo:string="21r11a05k0";
  const date:string = req.query.date as string;
  const subName :string =req.query.subName as string;
  const fromTime:string =req.query.fromTime as string;
  const toTime:string =req.query.toTime as string;
  const branch :string =req.query.branch as string;
  const yearstring :string =req.query.year as string;
  const year:number = parseInt(yearstring,10);
  const section :string =req.query.section as string;
  if (isAnyUndefined(rollNo,date,subName,branch,year,section,fromTime,toTime)) {
    res.status(400).json(responses.NotAllParamsGiven);
    return;
  }
  try{
    const attendancequery = `
      SELECT * FROM attendance
      WHERE date = ? AND fromTime = ? AND toTime = ?
    `;
    let result:attendance[]=await dbQuery(attendancequery, [date, fromTime, toTime]) as attendance[];
    // console.log(result);
    if(result.length!=0){
      let studentList :studentPresent[] =new Array(result.length);
      for(let i=0;i<result.length;i++){
        let temp :studentPresent={
          name:"",
          rollNo:"",
          isPresent:false,
        };
        temp.rollNo=result[i].rollNo;
        let studentName:string[]= await dbQuery(`select CONCAT(firstName,lastName) from student where rollNo='${result[i].rollNo}'`) as string[];
        temp.name=studentName[0];
        temp.isPresent=result[i].isPresent;
        studentList[i]=temp;
      }
      res.status(200).json(studentList);
    }else{
      
      const query = `
      SELECT * FROM student
      WHERE branch = ? AND year = ? AND section = ?
      `;
      const students: student[] = await dbQuery(query, [branch, year, section]) as student[];
      console.log(students);
      let studentList :studentPresent[] =new Array(students.length);
      for(let i=0;i<students.length;i++){
        let temp :studentPresent={
          name:"",
          rollNo:"",
          isPresent:false,
        };
        temp.rollNo=students[i].rollNo;
        temp.name=students[i].lastName+" "+students[i].firstName;
        // console.log(temp.name);
        studentList[i]=temp;
      }
      // let studentList: studentPresent[] = students.map(student => ({
      //   name: `${student.lastName} ${student.firstName}`,
      //   rollNo: student.rollNo,
      //   isPresent: false // Default value or set accordingly
      // }));
      res.status(200).json(studentList);
    }
  }catch (err) {
    logger.log("error", err);
    res.json(responses.ErrorWhileDBRequest);
  }
//   // res.status(200).json([{
//   //   "rollNo":"123",
//   //   "isPresent" : true,
//   // },
//   // {
//   //   "rollNo":"1286",
//   //   "isPresent" : true,
//   // },
//   // {
//   //   "rollNo":"689",
//   //   "isPresent" : false,
//   // },
//   // {
//   //   "rollNo":"134",
//   //   "isPresent" : true,
//   // },
//   // {
//   //   "rollNo":"345",
//   //   "isPresent" : false,
//   // },

// ]);
}
function formatDate(inputDate: string): string {
  // Split the input date string by '-'
  const [year, month, day] = inputDate.split('-');

  // Reformat and return the date in 'dd-mm-yyyy' format
  return `${day}-${month}-${year}`;
}
export async function markAttendance(req: Request, res: Response){
    console.log(req.body);
    const {
      fromTime,
      toTime,
      fid,
      subid,
      date,
      subName,
      students,
    } = req.body;
    if (isAnyUndefined(date,subName,fid,subid,students,fromTime,toTime)) {
      res.status(400).json(responses.NotAllParamsGiven);
      return;
    }
    const formatdate=formatDate(date);
    try{
      const query =` REPLACE INTO attendance VALUES (?,?,?,?,?,?,?,?)`;
      for (const student of students) {
        console.log(student.rollNo);
        await dbQuery(query,[formatdate,fromTime,toTime,subid,fid,student.rollNo,'admin',student.isPresent]);
      }
      console.log("done");
      res.status(200).json({message: 'Attendance submitted successfully'});
    }catch (err) {
      logger.log("error", err);
      res.json(responses.ErrorWhileDBRequest);
    }

    //res.sendStatus(200);
}
