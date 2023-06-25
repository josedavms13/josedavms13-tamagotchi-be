import {Response} from "express";
import {closeSession, createSession, Game} from "./Domain/sessionManager";

export function startSessionControl(req: any, res: Response) {
   const {game, gameTime} = req.body;
   if (!game) {
      return res.status(400).json({error: "game is required"});
   }
   if (!availableGames.includes(game)) {
      return res.status(400).json({error: "game is not available"});
   }
   let gameType: Game = Game.TicTacToe;
   switch (game as keyof typeof availableGames) {
   case "ticTacToe":
      gameType = Game.TicTacToe;
      break;
   }
   const startedSession = createSession(gameType, gameTime);
   return res.json(startedSession);
}

export function closeSessionControl(req: any, res: Response) {
   const {sessionId} = req.body;
   if (!sessionId) {
      return res.status(400).json({error: "sessionId is required"});
   }
   const closedSession = closeSession(sessionId);
   return res.json(closedSession);
}

const availableGames = [
   "ticTacToe",
] as const;
