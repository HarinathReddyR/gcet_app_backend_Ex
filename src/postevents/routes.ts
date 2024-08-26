import { Router } from "express"; 
import { getEventForm, getEventRegResponse, getEventRegUsers, getEvents, getMyEvents, postEvents, postUserEventReg } from "./controller";
import defineStorage from "../services/upload";
import { isAdmin, verifyToken } from "../login/controller";

const router: Router = Router(); 
 
// Registering all the module routes here

router.post("", isAdmin, defineStorage('public/posts/').array('images'), verifyToken, postEvents);
router.get("/display", getEvents);
router.get("/display/:user", getMyEvents);
router.get("/form/:eventID", getEventForm);
router.get("/:eventId/registrations", isAdmin, getEventRegUsers);
router.get("/:eventId/responses/:user", isAdmin, getEventRegResponse);
router.post("/form", postUserEventReg);
 
export default router; 