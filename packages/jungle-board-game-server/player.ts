import { Server, Socket } from 'socket.io'
import { generateId } from './utils'

class Player {
  roomId: string
  io: Server
  name: string
  socket?: Socket

  constructor(roomId: string, io: Server, name: string, socket?: Socket) {
    this.roomId = roomId;
    this.io = io;
    this.socket = socket;
    this.name = name;
  }
}

export default Player