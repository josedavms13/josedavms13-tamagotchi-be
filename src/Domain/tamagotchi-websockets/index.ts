import {Server} from "socket.io";
import {getLogger} from "../../helpers/logger";
import {Response} from "express";
import {SocketsEvents} from "../Session/SocketsEvents";

const logger = getLogger("WebSocket");

const ios: IOServer [] = [];
let estimatedPort = Number(process.env.WEBSOCKETPORT!);


export function socketConnect(res?: Response) {
   if (ios.at(-1)?.port === estimatedPort) {
      logger.warn(`Port ${ estimatedPort } is in use... trying next port`);
      estimatedPort++;
      socketConnect(res);
   }
   try {
      logger.log(`Opening server on port ${ estimatedPort }`);
      ios.push({
         port: estimatedPort,
         server: createIoServer(estimatedPort),
      });
      res?.status(200).json({
         message: "Socket server created on port " + estimatedPort,
         port: estimatedPort,
      });
      logger.log(`Socket server created on port ${ estimatedPort }`);
   } catch (e: any) {
      logger.error(`Error crating websockets server on port: ${
         estimatedPort }`);
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
      console.log("Connected");
      // const query = JSON.parse(socket.handshake.query)
   });

   return io;
}

interface IOServer {
   port: number,
   server: Server,
}
