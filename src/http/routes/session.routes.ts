import {Router} from "express";
import {
   closeSessionControl,
   startSessionControl,
} from "../controllers/Session/Session.controller";

// eslint-disable-next-line new-cap
const router = Router();

router.post("/create-session", startSessionControl);
router.post("/close-session", closeSessionControl);

export default router;
