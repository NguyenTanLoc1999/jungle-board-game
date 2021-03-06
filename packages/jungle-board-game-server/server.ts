import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { generateId } from './utils';
import Room from './room'
import { Event } from './constants/events';

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const roomMap: Map<string, Room> = new Map()

app.use(cors());

app.get("/rooms", (_, res) => {
  const mapToArray = Array.from(roomMap).map(([name]) => name)
  return res.json({ rooms: mapToArray });
});

app.get("/room/:roomId", (req, res) => {
  const { roomId } = req.params;

  if (roomId) {
    const room = roomMap.get(roomId + '')

    if (room) {
      const { players } = room

      if (players.size === 1) {
        const [[_, value]] = players
        return res.json({ room: { readyPlayers: room.countPlayers(), opponentName: value.name } })
      }

      return res.json({ room: { readyPlayers: room.countPlayers() } })
    }
  }

  return res.json({ room: null });
});

app.post("/create-room", (req, res) => {
  const roomId = generateId();
  roomMap.set(roomId, new Room(roomId, io))
  return res.json({ roomId })
})

io.on("connection", socket => {
  // a player join room
  socket.on(Event.ROOM, ({ roomId, playerName }) => {
    const room = roomMap.get(roomId)
    if (room) {
      const player = room.join(socket, playerName)

      // boardcast to another player that a new player has joined the room
      if (player) {
        socket.to(roomId).emit(Event.PLAYER_JOINED, player.name)
      }
    }
  })

  // a player make a move
  socket.on(Event.MOVE, data => {
    const { roomId, moveFrom, moveTo } = data

    socket.to(roomId).emit(Event.MOVE, { moveFrom, moveTo })
  })

  // start to play
  socket.on(Event.PLAY, () => {
    const { roomId } = socket.data ?? {}
    const room = roomMap.get(roomId)

    if (room) {
      if (room.countPlayers() === 2) {
        socket.to(roomId).emit(Event.PLAY, true)
      }
    }
  })

  // a player disconnect
  socket.on("disconnect", () => {
    const { roomId } = socket.data ?? {}
    const room = roomMap.get(roomId)
    if (room) {
      // emit to another player that we leave the room
      socket.to(roomId).emit(Event.PLAYER_DISCONNECT)

      room.leave(socket)

      if (room.countPlayers() === 0) {
        roomMap.delete(roomId)
      }
    }
  })
})

server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});