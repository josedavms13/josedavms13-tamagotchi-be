import log4js from "log4js";
import {Logger as LoggerType} from "log4js";

class Logger {
   private logger: LoggerType;

   constructor(category: string) {
      log4js.configure({
         appenders: {
            out: {type: "stdout"},
            app: {type: "file", filename: "application.log"},
         },
         categories: {
            default: {appenders: ["out", "app"], level: "debug"},
         },
      });
      this.logger = log4js.getLogger(category);
   }

   public log(message: string | any) {
      if (typeof message === "string") {
         this.logger.debug(message);
      } else {
         this.logger.debug(JSON.stringify(message));
      }
   }

   public error(message: string | any) {
      this.logger.error(message);
   }

   public trace(message: any) {
      this.logger.trace(message);
   }

   public success(message: string) {
      this.logger.info(`\t ======== ${ message.toUpperCase() } ========`);
   }
}


export function getLogger(category: string): Logger {
   return new Logger(category);
}
