export const SocketsEvents = {
   Connect: "connection",
   ConnectionError: "connectionError",
   Disconnect: "forceDisconnect",
   InternalMessage: "internalMessage",
   SuccessConnect: "successConnect",
   MinPlayersFulfilled: "minPlayersFulfilled",
} as const;

export const SocketResultCode = {
   maxPlayers: {name: "maxPlayers", code: 402},
   successConnect: {name: "successConnect", code: 200},
};
