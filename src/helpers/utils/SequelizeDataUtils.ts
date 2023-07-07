// Todo: Define types


import {getLogger} from "../logger";
import {tDBOperationOutput} from "../../http/controllers/controllers.types";

const logger = getLogger("Utils, Sequelize Data Utils");

export function getResDataFromPromiseSettled(
   results: any, isFromController: any) {
   return results.filter((result: any) => result.status === "fulfilled")
      .map((result: any) => result.value)
      .map((result: any) => isFromController ? result.resData : result)
      .map((results: any) => isFromController ?
         getValuesFromDBOperations(results) :
         results);
}

// Todo: define types

/**
 * Converts the output of a DB Operation and extract the data.
 * If dbData is a Sequelize Object, it will return dataValues
 * @template T
 * @param {tDBOperationOutput<T>} results - is the result of the DB Operation
 * @return {T[]} Array of dataValues. If it is just one element,
 * it will be returned as array of length 1
 */
export function getValuesFromDBOperations<T>(
   results: tDBOperationOutput<T>)
   : T[] | null {
   if (results.success) {
      if (Array.isArray(results.dbData)) {
         return results.dbData.map((result: { dataValues: any; }) => {
            return result.dataValues ? result.dataValues : result;
         }) as T[];
      } else {
         return [results.dbData.dataValues ? results.dbData.dataValues :
            results.dbData] as T[];
      }
   } else {
      logger.error("Operation failed", results);
      return null;
   }
}

export function getDBDataValues<T>(data: any, asArray?: boolean): T | T[] {
   if (Array.isArray(data)) {
      return data.map((item: any) => {
         if (item.dataValues) {
            return item.dataValues;
         } else {
            return asArray ? [item] : item;
         }
      });
   } else {
      if (data.dataValues) {
         return asArray ? [data.dataValues] : data.dataValues;
      } else {
         return asArray ? [data] : data;
      }
   }
}

