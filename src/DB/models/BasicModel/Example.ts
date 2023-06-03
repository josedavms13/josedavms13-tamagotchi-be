/* eslint-disable new-cap */
import {Column, DataType, Model, Table} from "sequelize-typescript";


@Table
export class Example extends Model<Example, exampleAttributes> {
   @Column({type: DataType.STRING})
   declare name: string;

   /* @HasMany(()=> Model, {foreignKey: "foreignKey"})
   declare models: Model[]; */
}


interface exampleAttributes {
   name: string,
   other: string,
}
