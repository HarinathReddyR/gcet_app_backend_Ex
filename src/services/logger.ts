import dayjs from "dayjs";
import { logInConsole } from '../../config-local';

type TLogOptions = "info" | "warn" | "error" | "fatal"

export function log(ltype:TLogOptions='info', ...lmessage: any[]) {
    let dt = dayjs().format("D-MMM-YYYY hh:mm:ss A");
    let msg = `[${dt}] [${ltype.padEnd(5)}] ${lmessage.join(' ')}`
    if(logInConsole) console.log(msg);
}