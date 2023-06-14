import {Request, Response, Router} from "express";
import {getLogger} from "../../helpers/logger";
import {Environments} from "../DB/config/enums";
import {getEnvironment} from "../DB/config/dbConfig";
import taskRoutes from "./task.routes";

const logger = getLogger("ROUTES");

// eslint-disable-next-line new-cap
const router = Router();

router.use("/task", taskRoutes);


router.get("/", (req: Request, res: Response) => {
   if (getEnvironment() === Environments.development) {
      logger.log("UNIDLE");
      res.status(200);
      res.end();
   } else {
      res.status(404);
      res.end();
   }
});
export default router;
