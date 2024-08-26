import { Response, Request, NextFunction } from "express";
import md5 from "md5";

import dbQuery from "../services/db";
import * as logger from "../services/logger";
import { secret } from "../../config-local";
import { isAnyUndefined, responses } from "../services/common";
import { mailOptions, transporter } from "../services/email";

function generateToken(username: string) {
  return username + "@" + md5(username + secret);
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString() {
  const alpha: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTUVWXYZ";
  const special: string = '!@#$%^&*()<>?;';
  const digits: string = '1234567890';
  const all: string = alpha + special + digits;
  const len = all.length;
  var ar = ['-', '-', '-', '-', '-', '-', '-', '-'];
  var count: number = 0;
  while (count != 5) {
    var ind: number = randomInteger(0, 8);
    if (ar[ind] != '-') continue;
    var salt: number = randomInteger(0, len);
    var index: number = randomInteger(0, len);
    ar[ind] = all[(index + salt) % len];
    count++;
  }
  console.log(ar);
  let a: boolean = false, d: boolean = false;
  let s: boolean = false;
  for (let i = 0; i < 8; i++) {
    if (ar[i] == '-' && !a) {
      var salt: number = randomInteger(0, alpha.length);
      var index: number = randomInteger(0, alpha.length);
      ar[i] = alpha[(index + salt) % alpha.length];
      a = true;
    } else if (ar[i] == '-' && !d) {
      var salt: number = randomInteger(0, digits.length);
      var index: number = randomInteger(0, digits.length);
      ar[i] = digits[(index + salt) % digits.length];
      d = true;
    } else if (ar[i] == '-' && !s) {
      var salt: number = randomInteger(0, special.length);
      var index: number = randomInteger(0, special.length);
      ar[i] = special[(index + salt) % special.length];
      s = true;
    }
  }
  console.log(ar);
  return ar.join('');
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  // console.log('hello token');
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const [username, _Token] = token.split("@");
    if (generateToken(username) === token) {
      req.body.usernameInToken = username;
      next();
      return;
    }
  }
  res.status(401).send("Unauthorized"); // Respond with Unauthorized status
}

export function isUserValid(req: Request, res: Response) {
  const username = req.body.username as string;
  const password = req.body.password as string;
  const ip = req.ip as string;

  dbQuery(
    `select userName, password from users where binary username="${username}"`
  )
    .then(function (result: any) {
      if (result.length !== 1) {
        res.json({
          error: `Username ${username} does not exist`,
        });
        return;
      }

      const passwordHash = md5(password);

      if (passwordHash !== result[0]["password"]) {
        res.json({ error: `Incorrect password` });
        return;
      }

      logger.log("info", `${username} has logged in from ${ip.slice(7)}`);
      res.cookie("Token", generateToken(username), { httpOnly: true });
      res.status(200).json({
        token: generateToken(username)
      });
    })
    .catch(function (err) {
      logger.log("error", err);
      res.status(500).json({
        goahead: false,
        error: "An unexpected error occurred while accessing the database.",
      });
    });
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {

  try {
    const res: any = await dbQuery(`select isAdmin from users where username = '${req.body.usernameInToken}'`);
    if (res[0]['isAdmin'] !== 1) {
      res.status(401).json("Unauthorized");  
      return;
    }
    next();
  } catch(err) {
    logger.log("error", err);
    return res.status(500).json("Error in DB");
  }
  
}

export async function sendOTP(req: Request, res: Response) {
  const username = req.query.username as string;
  if (isAnyUndefined(username)) {
    res.status(400).json(responses.NotAllParamsGiven);
    return;
  }
  try {
    //console.log(username);
    const result = (await dbQuery(
      `SELECT username FROM users WHERE username = "${username}";`
    )) as any;
    //console.log(result[0].username);
    if (result.length == 0) {
      res.status(200).json({ "user": false, "email": false });
    } else {
      var pass: string = randomString();
      console.log(pass);
      mailOptions.subject = "OTP from GCET Connect";
      mailOptions.text = "your otp change password is \n" + pass;
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error sendong mail");
          return res.status(500).send({ "user": true, "email": false });
        }
        console.log("Message sent: %s", info.messageId);
        //res.status(200).send({"user":true,"email":false });
      });
      var password = md5(pass);
      await dbQuery(`UPDATE users SET password='${password}' WHERE username='${username}'`);
      res.status(200).send({ "user": true, "email": true });
    }
  } catch (err) {
    logger.log("error", err);
    res.json(responses.ErrorWhileDBRequest);
  }
}

