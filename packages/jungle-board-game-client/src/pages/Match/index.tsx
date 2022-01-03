import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { dequal } from "dequal";
import clsx from "clsx";
import socketIOClient, { Socket } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ROWS, COLS } from "src/services/gameLogic";
import { game, GameStatus } from "src/services/game";
import Show from "src/components/Show";
import useLocalStorage from "src/hooks/useLocalStorage";
import { apiDomain, PLAYER_NAME } from "src/constants";

import { Event } from 'jungle-board-game-server/constants/events'
import { IResGetRoom } from 'jungle-board-game-server/types'
import generateName from "src/utils/generate-name";

const BOARD_ROWS = Array.from(Array(ROWS).keys());
const BOARD_COLS = Array.from(Array(COLS).keys());

const SQUARE_WIDTH = 80;
const SQUARE_HEIGHT = 80;

const Match: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(true);
  const [canMakeMove, setCanMakeMove] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<number[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>();
  const [isHost, setIsHost] = useState(false);
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useLocalStorage(PLAYER_NAME, "");
  const [opponentName, setOpponentName] = useState("");

  const { roomId } = useParams();

  const possibleMoves = selectedSquare.length
    ? game.getMoves(selectedSquare[0], selectedSquare[1])
    : [];
  const isGameEnded = game.gameStatus === GameStatus.ENDED;

  const onSelectSquare = (row: number, col: number) => () => {
    // move to possible square
    const moveTo = possibleMoves.find((move) => dequal(move, { row, col }));
    if (!!moveTo) {
      const moveFrom = { row: selectedSquare[0], col: selectedSquare[1] };
      game.move(moveFrom, moveTo, setCanMakeMove);

      socket?.emit("move", { roomId, moveFrom, moveTo });
      setCanMakeMove(false);

      return setSelectedSquare([]);
    }

    // deselect square
    if (dequal(selectedSquare, [row, col])) return setSelectedSquare([]);

    //can only select animal square
    if (canMakeMove && game.canSelect(row, col)) setSelectedSquare([row, col]);
  };

  const onClickPlay = () => {
    socket?.emit(Event.PLAY)
    game.startGame("B", false);
    setOpenMenu(false);
    setCanMakeMove(true);
  };

  useEffect(() => {
    const fetchRoomInfo = async () => {
      const {
        data: { room },
      } = await axios.get<IResGetRoom>(`${apiDomain}/room/${roomId}`);

      // if room doesn't exist or the room has full players, redirect to home page
      if (!room || (room && room.readyPlayers === 2)) {
        navigate('/')
      }

      // join the room as the second player
      // get the opponent player's name
      if (room.readyPlayers === 1) {
        setOpponentName(room.opponentName)
      } else {
        setIsHost(true)
      }
    }

    fetchRoomInfo()
  }, [])

  useEffect(() => {
    const socket = socketIOClient(apiDomain, { transports: ["websocket"] });
    setSocket(socket);

    let newPlayerName = playerName
    // the player directly nagivate to the room instead of entering their name first on home page
    // => generate a new name for them
    if (!newPlayerName) {
      newPlayerName = generateName()
      setPlayerName(newPlayerName)
    }

    // join the room by roomId
    socket.emit(Event.ROOM, { roomId, playerName });

    // as the host player, listen to the second player and get their name
    socket.on(Event.PLAYER_JOINED, (opponentName) => {
      setOpponentName(opponentName);
    });

    // start to play the game, the host move first
    socket.on(Event.PLAY, (canPlay) => {
      if (canPlay) {
        game.startGame("B", false)
        setCanMakeMove(false);
        setOpenMenu(false);
      }
    });

    // listen to a new move of opponent player
    socket.on(Event.MOVE, ({ moveFrom, moveTo }) => {
      game.move(moveFrom, moveTo, null, true)
      setCanMakeMove(true);
    });

    // listen to opponent disconnection
    socket.on(Event.PLAYER_DISCONNECT, () => {
      setOpponentName('')
      setIsHost(true)
    })

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <div>{opponentName}</div>

      <div
        className="board"
        style={{
          width: SQUARE_WIDTH * BOARD_COLS.length,
          height: SQUARE_HEIGHT * BOARD_ROWS.length,
        }}
      >
        {BOARD_ROWS.map((row) =>
          BOARD_COLS.map((col) => (
            <div
              key={`${row}${col}`}
              style={{
                width: SQUARE_WIDTH,
                height: SQUARE_HEIGHT,
                top: row * 80,
                left: col * 80,
              }}
              className={clsx(
                { "board-item": true },
                { selected: dequal(selectedSquare, [row, col]) },
                {
                  canMove: !!possibleMoves.find((move) =>
                    dequal(move, { row, col })
                  ),
                }
              )}
            >
              <div
                className={clsx(
                  { "board-square": true },
                  { land: game.isLand(row, col) },
                  { river: game.isRiver(row, col) },
                  { trap: game.isWTrap(row, col) || game.isBTrap(row, col) },
                  { den: game.isWDen(row, col) || game.isBDen(row, col) }
                )}
                onClick={onSelectSquare(row, col)}
              >
                <span>{game.getPieceKind(game.state.board[row][col])}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <span>{playerName}</span>
        {isHost && <button onClick={onClickPlay}>Play</button>}
      </div>

      {/* <Show when={openMenu || isGameEnded}>
        <div className="main-menu">
          <Show when={!isGameEnded}>
            <div className="menu">
              <div className="menu-item" onClick={onClickStart}>
                Single Player
              </div>
              <div className="menu-item">Options</div>
              <div className="menu-item">Credit</div>
            </div>
          </Show>

          <Show when={isGameEnded}>
            <div>Game Ended!</div>
          </Show>
        </div>
      </Show> */}
    </div>
  );
};

export default Match;
