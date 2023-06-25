import {GamesNames} from "./games.types";
import {Session} from "../Session";
import {httpServer} from "../../../index";
import {Player} from "./Player";
import {getLogger} from "../../../helpers/logger";

const logger = getLogger("GAME CORE CLASS");

export abstract class GameCore {
   protected _sessionId: number;
   protected readonly _gameName: GamesNames;
   protected _session: Session;
   protected _players: Player[] = [];
   protected _currentPlayer: Player | null = null;
   protected _turn: number = -1;
   protected _maxAllowedPlayers: number;
   protected _minRequiredPlayers: number;

   protected constructor(
      sessionId: number,
      gameName: GamesNames,
      sessionTime: number,
      maxAllowedPlayers: number,
      minRequiredPlayers: number) {
      this._sessionId = sessionId;
      this._gameName = gameName;
      this._maxAllowedPlayers = maxAllowedPlayers;
      this._minRequiredPlayers = minRequiredPlayers;
      console.log(`The game "${
         gameName }" will last ${ sessionTime } minutes`);
      this._session = new Session(
         httpServer,
         gameName.toString(),
         sessionTime,
         maxAllowedPlayers,
         minRequiredPlayers,
         ({playerName, playerId}) => {
            logger.log(`Adding player ${ playerName } with id ${ playerId }`);
            this._players.push(new Player(playerId, playerName));
         },
      );
   }

   public abstract injectEvents(): void;

   protected startGame(): void {
      if (this._players.length === this._minRequiredPlayers) {
         this._turn = 0;
         this.setCurrentPlayer();
      }
   }

   protected changeTurn(): void {
      if (this._turn === this._players.length - 1) {
         this._turn = 0;
      } else {
         this._turn++;
      }
      this.setCurrentPlayer();
   }

   private setCurrentPlayer(): void {
      if (this._turn > -1) {
         this._currentPlayer = this._players[this._turn];
      }
   }

   get gameName(): string {
      return this._gameName.toString();
   }

   get currentTurnIndex() {
      if (this._turn < 0) {
         throw new Error("Game has not started yet");
      }
      return this._turn;
   }

   public close(): void {
      this._session.closeServer();
   }

   get currentPlayer(): Player {
      if (this._currentPlayer) {
         return this._currentPlayer;
      } else {
         throw new Error("Game hasn't started yet");
      }
   }

   get id() {
      return this._sessionId;
   }
}
