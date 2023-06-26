// @ts-ignore
// eslint-disable-next-line max-len
import {getLogger} from "../../helpers/logger";
import {tIOServer} from "./ioServer.types";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {Timer} from "./timer/Timer";
import {SocketResultCode, SocketsEvents} from "./SocketsEvents";
import {tEventPayload} from "./TicTacToe/TicTacEvents";
import {tIoEvent} from "./TicTacToe/ticTacToe.types";

const logger = getLogger("Session");

export class Session {
   private _isSessionStarted: boolean = false;
   private _isSessionPaused: boolean = true;
   private readonly ioServer: tIOServer;
   private pauses: number | undefined;
   private _timer: Timer;
   private readonly _io: Server<
      DefaultEventsMap, DefaultEventsMap
   >;
   private readonly roomName: string;
   private readonly _maxAllowedPlayers: number;
   private _sessionPlayerCount: number = 0;
   private readonly _minRequiredPlayers: number;

   private readonly _onPlayerConnected: ({playerName, playerId}: {
      playerId: string, playerName: string
   }) => void;

   constructor(
      roomName: string,
      ioServer: tIOServer,
      gameName: string,
      sessionTime: number,
      maxAllowedPlayers: number,
      minRequiredPlayers: number,
      onPlayerConnected: ({playerName, playerId}
         : { playerName: string, playerId: string }) => void,
   ) {
      this.ioServer = ioServer;
      this._io = new Server(this.ioServer, {cors: {origin: "*"}});
      this.roomName = roomName + `-${ this.getRandomNumber() }`;
      this._maxAllowedPlayers = maxAllowedPlayers;
      this._minRequiredPlayers = minRequiredPlayers;
      this._onPlayerConnected = onPlayerConnected;
      this._timer = new Timer(
         0,
         sessionTime,
         0,
         () => {
            this.onTimerTick();
         },
         () => {
            this.onSessionTimeout();
         });
      logger.log("Starting webSocket server");
      this.socketConnect();
   }

   private socketConnect() {
      logger.log("Starting session");
      this._isSessionStarted = true;
      this._timer.start();
      // New player joins the game
      this._io.on(SocketsEvents.Connect, (socket) => {
         if (this._sessionPlayerCount >= this._maxAllowedPlayers) {
            socket.emit(SocketsEvents.MaxPlayersFulfilled, {
               message: "Max allowed players reached",
            });
            return;
         }

         const clientId = socket.id;
         const onConnectionQuery = JSON.parse(
            socket.handshake.query.body as any);
         const {
            playerName: receivedPlayerName,
            roomName: receivedRoomName} = onConnectionQuery.query;
         if (!receivedRoomName) {
            socket.emit(SocketsEvents.ConnectionError, {
               message: "Room name not provided",
            });
            socket.disconnect(true);
            return;
         }
         if (receivedRoomName !== this.roomName) {
            socket.emit(SocketsEvents.ConnectionError, {
               message: "Wrong room name",
            });
            socket.disconnect(true);
            return;
         }
         if (!receivedPlayerName) {
            socket.emit(SocketsEvents.ConnectionError, {
               message: "Player Name is required",
            });
            socket.disconnect(true);
            return;
         }
         // Verify that new player can join if queue is full
         if (this._sessionPlayerCount < this._maxAllowedPlayers) {
            socket.join(receivedRoomName);
            this._onPlayerConnected({
               playerName: receivedPlayerName,
               playerId: clientId,
            });
            this._sessionPlayerCount++;
            socket.emit(SocketsEvents.SuccessConnect, {
               code: SocketResultCode.successConnect,
               message: `Welcome to the game ${ receivedPlayerName }!`,
            });
            this._io.to(this.roomName).emit(SocketsEvents.InternalMessage, {
               message: `One player joined the game! ${
                  this._minRequiredPlayers - this._sessionPlayerCount
               } missing`,
            });
            this._io.to(this.roomName).emit(SocketsEvents.AddPlayer, {
               arePlayerCompleted: this._sessionPlayerCount ===
                  this._minRequiredPlayers,
            });
            this._sessionPlayerCount++;
            if (this._sessionPlayerCount === this._maxAllowedPlayers) {
               this._io.to(this.roomName).emit(SocketsEvents.InternalMessage, {
                  message: "All players have joined the game!",
               });
            }
         }
      });
   }

   public closeServer() {
      logger.log("Closing server");
      this._io.to(this.roomName).emit("closeConnection");
      this._io.removeAllListeners();
   }

   private onSessionTimeout() {
      logger.log("Stopping");
      if (this.closeServer && typeof this.closeServer === "function") {
         this.closeServer();
      } else {
         logger.log("Close server is type " + typeof this.closeServer);
      }
   }


   private onTimerTick() {

   }

   get getRoomName() {
      return this.roomName;
   }

   get isSessionStarted(): boolean {
      return this._isSessionStarted;
   }

   public addIoEvent(eventName: string, payload: tIoEvent) {
      this._io.on(eventName, (data) => {
         logger.log(data);
      });
   }

   public emmitEvent<T>(eventName: string, payload: tEventPayload<T>) {
      this._io.to(this.roomName).emit(eventName, payload);
   }

   public emitEvent<T>(eventName: string, data: T, callBack?: () => void) {
      this._io.to(this.roomName).emit(eventName, callBack);
   }

   private getRandomNumber() {
      return Math.floor(Math.random() * 200);
   }
}
