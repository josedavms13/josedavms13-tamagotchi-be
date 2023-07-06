import {Response} from "express";
import {
   disposeServer,
   socketConnect,
} from "../../../Domain/tamagotchi-websockets";
import {getLogger} from "../../../helpers/logger";

const logger = getLogger("SESSION | Controller");

export function createWSServer(req: any, res: Response) {
   socketConnect(res);
}

export function closeSessionControl(req: any, res: Response) {
   try {
      disposeServer(5858);
      res.sendStatus(200);
   } catch (e) {
      res.status(500);
   }
}

const availableGames = [
   "ticTacToe",
] as const;
