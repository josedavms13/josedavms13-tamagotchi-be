import {GameCore} from "../../../../Domain/Session/GameCore/GameCore";


export class ActiveSessions {
   private _gameSessions: GameCore[] = [];
   private _activeSessions: number = 0;
   private static _instance: ActiveSessions;

   public addGameSession(game: GameCore) {
      this._gameSessions.push(game);
      this._activeSessions++;
   }

   public removeSessions(gameId: number) {
      const found = this._gameSessions.findIndex((game) => game.id === gameId);
      this._gameSessions[found].close();
      if (found > -1) {
         this._gameSessions.splice(found, 1);
         this._activeSessions--;
      }
   }

   public static generateSessionId(): number {
      return Math.floor(Math.random() * 100);
   }

   public getSessionById(id: number): GameCore | undefined {
      return this._gameSessions.find((game) => game.id === id);
   }

   get games() {
      return this._gameSessions;
   }

   get activeSessions() {
      return this._activeSessions;
   }

   public static getInstance(): ActiveSessions {
      if (!ActiveSessions._instance) {
         ActiveSessions._instance = new ActiveSessions();
      }
      return ActiveSessions._instance;
   }
}
