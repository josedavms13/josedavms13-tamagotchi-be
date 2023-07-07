import {Server} from "socket.io";
import {getLogger} from "../../helpers/logger";
import {Response} from "express";
import {SocketsEvents} from "../Session/SocketsEvents";

const logger = getLogger("WebSocket");

const ios: IOServer [] = [];
const estimatedPort = Number(process.env.WEBSOCKETPORT!);
const iosPortLimit = 5;


export function socketConnect(res?: Response) {
   const portToOpen = ios.length === 0 ?
      estimatedPort : ios.at(-1)!?.port + 1;
   try {
      if (ios.length >= iosPortLimit) {
         res?.status(203).json({
            message: "Port limit exceeded",
         });
         logger.warn("Port limit exceeded, no new connections opened");
         return;
      }
      logger.log(`Opening server on port ${ portToOpen }`);
      ios.push({
         port: portToOpen,
         server: createIoServer(portToOpen),
      });
      res?.status(200).json({
         message: "Socket server created on port " + portToOpen,
         port: portToOpen,
      });
      logger.log(`Socket server created on port ${ portToOpen }`);
   } catch (e: any) {
      logger.error(`Error crating websockets server on port: ${
         portToOpen }`);
      logger.error(e);
      res?.status(500).json(e);
   }
}

export function disposeServer(port: number) {
}


function createIoServer(port: number): Server {
   const io = new Server(port, {
      cors: {
         origin: "*",
      },
   });
   io.on(SocketsEvents.Connect, (socket) => {
      console.log(socket.handshake);
      socket.emit(SocketsEvents.SuccessConnect, "Welcome");
      console.log("Connected");
      // const query = JSON.parse(socket.handshake.query)
   });

   io.on(SocketsEvents.CreateRoom, (data) => {
      console.log(data);
      logger.log(`Creating room`);

   });

   return io;
}

interface IOServer {
   port: number,
   server: Server,
}
