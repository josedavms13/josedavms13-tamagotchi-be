import {ActiveSessions} from "./ActiveSessions";
import {TicTacToe} from "../../../../Domain/Session/TicTacToe/TicTacToe";
import {tDBOperationOutput} from "../../controllers.types";


export function createSession(game: Game, gameTime?: number)
   : tDBOperationOutput<number> {
   const activeSessions = ActiveSessions.getInstance();
   const sessionId = ActiveSessions.generateSessionId();
   try {
      switch (game) {
      case Game.TicTacToe:
         activeSessions.addGameSession(new TicTacToe(
            sessionId,
            15,
            2,
            2,
         ));
      }
      return {
         success: true,
         resStatus: 200,
         dbData: sessionId,
      };
   } catch (e) {
      return {
         success: false,
         resStatus: 500,
         message: "Error",
         reason: e,
      };
   }
}

export function closeSession(sessionId: number): tDBOperationOutput<number> {
   const activeSessions = ActiveSessions.getInstance();
   try {
      const activeSession = activeSessions.getSessionById(sessionId);
      if (!activeSession) {
         return {
            success: false,
            resStatus: 404,
            message: "Session not found",
         };
      }
      activeSessions.removeSessions(sessionId);
      return {
         success: true,
         resStatus: 200,
         dbData: sessionId,
      };
   } catch (e) {
      return {
         success: false,
         resStatus: 500,
         message: "Error",
         reason: e,
      };
   }
}


export enum Game {
   // eslint-disable-next-line no-unused-vars
   TicTacToe,
}
