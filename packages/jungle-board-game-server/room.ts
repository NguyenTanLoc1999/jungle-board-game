import { Server, Socket } from 'socket.io';
import Player from './player'

class Room {
  roomId: string
  io: Server
  cooldown: number
  numPlayers: number
  players: Map<Socket, Player> = new Map()

  constructor(roomId: string, io: Server) {
    this.roomId = roomId;
    this.io = io;
    this.cooldown = 10000;
    this.numPlayers = 2;
  }

  addPlayer(socket: Socket, playerName: string): Player {
    const player = new Player(this.roomId, this.io, playerName, socket)
    this.players.set(socket, player)

    return player
  }

  join(socket: Socket, playerName: string): Player | undefined {
    if (this.players.size >= this.numPlayers) return;

    socket.join(this.roomId);
    socket.data.roomId = this.roomId;

    return this.addPlayer(socket, playerName);
  }

  leave(socket: Socket) {
    socket.leave(this.roomId);
    this.players.delete(socket);
  }

  countPlayers(): number {
    return this.players.size;
  }
}

export default Room