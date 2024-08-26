import { Response, Request } from "express";
import fs from "fs";
import dbQuery from "../services/db";
import * as logger from "../services/logger";


export async function postEvents(req: Request, res: Response) {
    const { title, description, date, venue, reg, ques } = req.body;
    const usr: string = req.body.usernameInToken; 
    const imgs = req.files as Express.Multer.File[];
    if (imgs === undefined) {
        res.status(500).json({ "error": "No images selected" });
        return;
    }
    const fnames = imgs.map(img => img.originalname);
    const filePaths = imgs.map(img => img.path);

    try {
        const result: any = await dbQuery(
            'INSERT INTO events (usr, title, descr, date, venue, reg) VALUES (?, ?, ?, ?, ?, ?)',
            [usr, title, description, date, venue, reg]
        );
        const eventId = result.insertId;

        for (const name of fnames) {
            await dbQuery(
                'INSERT INTO event_imgs (id, img_path) VALUES (?, ?)',
                [eventId, `posts/` + name]
            );
        }


        const questions = JSON.parse(ques);
        console.log(questions);
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            await dbQuery(
                'INSERT INTO event_regform (id, ques, type, opts, qno) VALUES (?, ?, ?, ?, ?)',
                [eventId, question.question, question.type, question.options.join(','), i + 1]
            );
        }

        res.status(200).json({ "done": true });
    } catch (err) {
        filePaths.forEach(filePath => {
            fs.unlinkSync(filePath);
        });
        logger.log("error", err);
        res.status(500).json({ "done": false });
    }
}

async function checkReg(user: string, id: any) {
    try {
        const res: any = await dbQuery(`SELECT * FROM event_reg_users WHERE usr = '${user}' AND id = ${id}`);
        return (res.length > 0) ? 1 : 0;
    } catch (error) {
        throw error;
    }
}

export async function getEvents(req: Request, res: Response) {
    try {
        const result: any = await dbQuery(`
            SELECT
                e.id,
                e.usr,
                e.title,
                e.descr AS description,
                e.date,
                e.venue,
                d.img_path,
                e.reg
            FROM
                events e
            JOIN
                event_imgs d ON e.id = d.id
        `);

        // Construct the base URL for serving images
        const baseUrl = `${req.protocol}://${req.get("host")}/`;

        // Use Promise.all to wait for all checkReg promises to resolve
        const eventsWithImages = await Promise.all(result.map(async (event: any) => ({
            ...event,
            isReg: await checkReg(req.body.usernameInToken, event.id),
            img_url: baseUrl + event.img_path,  // Add full URL for the image
        })));
        console.log(eventsWithImages);
        res.status(200).json(eventsWithImages);
    } catch (err) {
        logger.log("error", err);
        res.status(500).json({ error: "Error fetching events" });
    }
}

export async function getMyEvents(req: Request, res: Response) {
    try {
        const result: any = await dbQuery(`
            SELECT
                e.id,
                e.usr,
                e.title,
                e.descr AS description,
                e.date,
                e.venue,
                d.img_path,
                e.reg,
                (SELECT COUNT(DISTINCT usr) FROM event_reg_users WHERE event_reg_users.id = e.id) AS registrations
            FROM
                events e
            JOIN
                event_imgs d ON e.id = d.id
            WHERE e.usr = '${req.params.user}'
        `);
        // Construct the base URL for serving images
        const baseUrl = `${req.protocol}://${req.get("host")}/`;

        // Map the result to include full image URLs
        const eventsWithImages = result.map((event: any) => ({
            ...event,
            img_url: baseUrl + event.img_path,  // Add full URL for the image
        }));
        res.status(200).json(eventsWithImages);
    } catch (err) {
        logger.log("error", err);
        res.status(500).json({ error: "Error fetching events" });
    }
}


export async function getEventRegUsers(req: Request, res: Response) {
    try {
        const tmp: any = await dbQuery(`SELECT usr from events where id = ${req.params.eventId}`);
        if (tmp[0]['usr'] !== req.body.usernameInToken) {
            res.status(401).json("Unauthorized");
            return;
        } 
        const result: any = await dbQuery(`
            SELECT DISTINCT usr FROM event_reg_users WHERE id = ${req.params.eventId}
        `);

        res.status(200).json(result);
    } catch (err) {
        logger.log("error", err);
        res.status(500).json({ error: "Error fetching events" });
    }
}

export async function getEventRegResponse(req: Request, res: Response) {
    const { user, eventId } = req.params;

    try {
        const tmp: any = await dbQuery(`SELECT usr from events where id = ${req.params.eventId}`);
        if (tmp[0]['usr'] !== req.body.usernameInToken) {
            res.status(401).json("Unauthorized");
            return;
        } 
        const result: any = await dbQuery(`
            SELECT 
                erf.qno AS question_number,
                erf.ques AS question,
                erf.type AS question_type,
                erf.opts AS options,
                eru.resp AS user_response
            FROM 
                event_reg_users eru
            JOIN 
                event_regform erf ON eru.id = erf.id AND eru.qno = erf.qno
            WHERE 
                eru.usr = ? 
                AND eru.id = ?
            ORDER BY 
                erf.qno;
        `, [user, eventId]);

        if (result.length === 0) {
            return res.status(404).json({ message: "No data found for this user and event." });
        }

        // Process the result to convert options and user_response
        const processedResult = result.map((row: any) => {
            // Convert options from comma-separated string to list
            const optionsList = row.options ? row.options.split(',').map((opt: string) => opt.trim()) : [];

            // Convert user_response from comma-separated string to list if needed
            const userResponseList = row.user_response ? row.user_response.split(',').map((resp: string) => resp.trim()) : [];

            return {
                question_number: row.question_number,
                question: row.question,
                question_type: row.question_type,
                options: optionsList,
                user_response: userResponseList,
            };
        });

        res.status(200).json(processedResult);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching registration responses" });
    }
}


export async function getEventForm(req: Request, res: Response) {
    try {
        const isReg = await checkReg(req.body.usernameInToken, req.params.eventID);
        if (isReg == 1) {
            res.status(409).json({ error: 'User is already registered for this event' });
            return;
        }
        const result: any = await dbQuery(
            `SELECT ques, type, opts FROM event_regform WHERE id = ? ORDER BY qno`,
            [req.params.eventID]
        );
        const formattedResult = result.map((row: any) => ({
            ques: row.ques,
            type: row.type,
            opts: row.opts ? row.opts.split(',') : []
        }));

        res.status(200).json(formattedResult);
    } catch (err) {
        logger.log("error", err);
        res.status(500).json({ error: "Error fetching form" });
    }
}

export async function postUserEventReg(req: Request, res: Response) {
    const { event_id, responses } = req.body;
    try {
        for (const response of responses) {
            await dbQuery(
                'INSERT INTO event_reg_users (id, usr, qno, resp) VALUES (?, ?, ?, ?)',
                [event_id, req.body.usernameInToken, response.qno, response.resp]
            );
        }
        res.status(200).json({ success: true });
    } catch (err) {
        logger.log("error", err);
        res.status(500).json({ error: "Error processing registration" });
    }
}

