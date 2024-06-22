import mysql from "mysql";

import { dbConfig } from "../../config-local";
import * as logger from "./logger";

const connection = mysql.createConnection(dbConfig);

connection.connect((err, result) => {
  if(err){
    logger.log("fatal", "Database error", err)
    logger.log("warn", "You need to restart the server to retry, connecting to database")
  }else
    logger.log("info", "Connected to database");
});

async function  dbQuery(query: string, parms?:any[]) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction();
    connection.query(query, parms, (err, result, fields) => {
      if (err) {
        connection.rollback();
        reject(err);
      }
      else {
        connection.commit();
        resolve(result);
      }
    });
  });
}

export function dbQueryWithFields(query: string, parms?:any[]) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction();
    connection.query(query, parms, (err, result, fields) => {
      
      if (err) {
        connection.rollback();
        reject(err);
      }
      else {
        connection.commit();
        resolve(result);
      }
    });
  });
}

export default dbQuery;