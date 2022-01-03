export interface IReqCreateRoom {
  name: string;
}

export interface IResCreateRoom {
  roomId: string;
}

export interface IResGetRoom {
  room: {
    opponentName?: string
    readyPlayers?: number
  } | null
}