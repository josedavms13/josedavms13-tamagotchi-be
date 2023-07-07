import {ActiveSessions} from "./ActiveSessions";
import {TicTacToe} from "../../../../Domain/Session/TicTacToe/TicTacToe";
import {tDBOperationOutput} from "../../controllers.types";


export function createSession(game: Game, roomName: string, gameTime?: number)
   : tDBOperationOutput<number> {
   const activeSessions = ActiveSessions.getInstance();
   const sessionId = ActiveSessions.generateSessionId();
   try {
      switch (game) {
      case Game.TicTacToe:
         try {
            const createdSession = activeSessions.addGameSession(new TicTacToe(
               roomName,
               sessionId,
               15,
               2,
               2,
            ));
            return {
               success: true,
               resStatus: 200,
               dbData: {
                  sessionId,
                  roomName: createdSession.gameRoomName,
               },
            };
         } catch (e) {
            return {
               success: false,
               resStatus: 204,
               message: "Error creating session",
               reason: e,
            };
         }
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
