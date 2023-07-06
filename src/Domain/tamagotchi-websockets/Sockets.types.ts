

export interface IConnectionOpener {
   connectionType: ConnectionOpenerType,
   payload: string
}


export enum ConnectionOpenerType {
   CREATE_ROOM, JOIN_ROOM
}
