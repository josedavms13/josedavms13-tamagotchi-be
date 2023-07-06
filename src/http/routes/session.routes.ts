import {Router} from "express";
import {
   closeSessionControl,
   createWSServer,
} from "../controllers/Session/Session.controller";

// eslint-disable-next-line new-cap
const router = Router();

router.get("/create-session", createWSServer);
router.post("/close-session", closeSessionControl);

export default router;
