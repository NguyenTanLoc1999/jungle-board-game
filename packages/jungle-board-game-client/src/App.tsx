import React from "react";
import { dequal } from "dequal";
import clsx from "clsx";
import { ROWS, COLS } from "./services/gameLogic";
import { game, GameStatus } from "./services/game";
import Show from "./components/Show";

import "./App.scss";

const BOARD_ROWS = Array.from(Array(ROWS).keys());
const BOARD_COLS = Array.from(Array(COLS).keys());

const SQUARE_WIDTH = 80;
const SQUARE_HEIGHT = 80;

const App: React.FC = () => {
  const [openMenu, setOpenMenu] = React.useState(true);
  const [selectedSquare, setSelectedSquare] = React.useState<number[]>([]);

  const possibleMoves = selectedSquare.length
    ? game.getMoves(selectedSquare[0], selectedSquare[1])
    : [];
  const isGameEnded = game.gameStatus === GameStatus.ENDED

  const onSelectSquare = (row: number, col: number) => () => {
    // move to possible square
    const moveTo = possibleMoves.find((move) => dequal(move, { row, col }));
    if (!!moveTo) {
      const moveFrom = { row: selectedSquare[0], col: selectedSquare[1] };
      game.move(moveFrom, moveTo);
      return setSelectedSquare([]);
    }

    // deselect square
    if (dequal(selectedSquare, [row, col])) return setSelectedSquare([]);

    //can only select animal square
    if (game.canSelect(row, col)) setSelectedSquare([row, col]);
  };

  const onClickStart = () => {
    game.startGame();
    setOpenMenu(false);
  };

  return (
    <div className="App">
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

      <Show when={openMenu || isGameEnded}>
        <div className="main-menu">
          <Show when={!isGameEnded}>
            <div className="menu">
              <div className="menu-item" onClick={onClickStart}>
                Play Game
              </div>
              <div className="menu-item">Options</div>
              <div className="menu-item">Credit</div>
            </div>
          </Show>

          <Show when={isGameEnded}>
            <div>Game Ended!</div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default App;
