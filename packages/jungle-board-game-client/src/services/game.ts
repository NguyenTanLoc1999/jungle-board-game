import { dequal } from "dequal";
import * as gameLogic from "./gameLogic";
import * as ai from "./ai";

export enum GameStatus {
  READY = "Ready",
  PLAYING = "Playing",
  PAUSE = "Pause",
  ENDED = "Ended",
}

type History = {
  moves: gameLogic.Board[];
};

class Game {
  state: gameLogic.IState = { board: [] };
  playerTurn: string;

  gameStatus: GameStatus;

  history: History = { moves: [] };

  constructor() {
    this.state.board = gameLogic.getEmptyBoard();
    this.playerTurn = "";
    this.gameStatus = GameStatus.READY;
  }

  startGame(): void {
    this.gameStatus = GameStatus.PLAYING;
    this.state.board = gameLogic.getInitialBoard();
    this.playerTurn = gameLogic.PlayerSymbol.B;
  }

  canSelect(row: number, col: number): boolean {
    if (this.gameStatus !== GameStatus.PLAYING) return false;

    const piece = this.state.board[row][col];
    if (
      this.playerTurn === piece.charAt(0) &&
      piece.substring(1) !== gameLogic.Structure.Den &&
      piece.substring(1) !== gameLogic.Structure.Trap
    ) {
      const deltaFrom = { row, col };
      const possibleMoves = gameLogic.getPiecePossibleMoves(
        this.state.board,
        this.playerTurn,
        deltaFrom
      );
      return possibleMoves.length > 0;
    }

    return false;
  }

  getMoves(row: number, col: number): gameLogic.BoardDelta[] {
    if (!this.canSelect(row, col)) return [];

    const deltaFrom = { row, col };
    const possibleMoves = gameLogic.getPiecePossibleMoves(
      this.state.board,
      this.playerTurn,
      deltaFrom
    );
    return possibleMoves;
  }

  getPieceKind(piece: string): string {
    switch (piece) {
      case gameLogic.PieceName.BElephant:
        return gameLogic.PieceName.BElephant;
      case gameLogic.PieceName.BLion:
        return gameLogic.PieceName.BLion;
      case gameLogic.PieceName.BTiger:
        return gameLogic.PieceName.BTiger;
      case gameLogic.PieceName.BLeopard:
        return gameLogic.PieceName.BLeopard;
      case gameLogic.PieceName.BWolf:
        return gameLogic.PieceName.BWolf;
      case gameLogic.PieceName.BDog:
        return gameLogic.PieceName.BDog;
      case gameLogic.PieceName.BCat:
        return gameLogic.PieceName.BCat;
      case gameLogic.PieceName.BMouse:
        return gameLogic.PieceName.BMouse;

      case gameLogic.PieceName.WElephant:
        return gameLogic.PieceName.WElephant;
      case gameLogic.PieceName.WLion:
        return gameLogic.PieceName.WLion;
      case gameLogic.PieceName.WTiger:
        return gameLogic.PieceName.WTiger;
      case gameLogic.PieceName.WLeopard:
        return gameLogic.PieceName.WLeopard;
      case gameLogic.PieceName.WWolf:
        return gameLogic.PieceName.WWolf;
      case gameLogic.PieceName.WDog:
        return gameLogic.PieceName.WDog;
      case gameLogic.PieceName.WCat:
        return gameLogic.PieceName.WCat;
      case gameLogic.PieceName.WMouse:
        return gameLogic.PieceName.WMouse;

      default:
        return "";
    }
  }

  move(deltaFrom: gameLogic.BoardDelta, deltaTo: gameLogic.BoardDelta, setCanMakeMove?: (canMove: boolean) => void): void {
    if (this.state.board) {
      const { prevBoard, nextBoard, winner } = gameLogic.makeMove(this.state.board, deltaFrom, deltaTo)

      this.history.moves.push(prevBoard)
      this.state.board = nextBoard

      if (winner) {
        this.gameStatus = GameStatus.ENDED;
        return;
      }

      setCanMakeMove && setCanMakeMove(false);
      this.computerMove(setCanMakeMove);
    }
  }

  computerMove(setCanMakeMove?: (canMove: boolean) => void): void {
    setTimeout(() => {
      if (this.state.board) {
        const [deltaFrom, deltaTo] = ai.createComputerMove(this.state.board, gameLogic.PlayerSymbol.W)
        const { prevBoard, nextBoard, winner } = gameLogic.makeMove(this.state.board, deltaFrom, deltaTo)

        this.history.moves.push(prevBoard)
        this.state.board = nextBoard

        if (winner) {
          this.gameStatus = GameStatus.ENDED;
          return;
        }

        setCanMakeMove && setCanMakeMove(true)
      }
    }, 1000);
  }

  isRiver(row: number, col: number): boolean {
    return !!gameLogic.RiverPos.find((pos) => dequal(pos, { row, col }));
  }

  isWTrap(row: number, col: number): boolean {
    return !!gameLogic.WhiteTraps.find((pos) => dequal(pos, { row, col }));
  }

  isBTrap(row: number, col: number): boolean {
    return !!gameLogic.BlackTraps.find((pos) => dequal(pos, { row, col }));
  }

  isWDen(row: number, col: number): boolean {
    return dequal(gameLogic.WhiteDen, { row, col });
  }

  isBDen(row: number, col: number): boolean {
    return dequal(gameLogic.BlackDen, { row, col });
  }

  isLand(row: number, col: number): boolean {
    return (
      !this.isRiver(row, col) &&
      !this.isWTrap(row, col) &&
      !this.isBTrap(row, col) &&
      !this.isWDen(row, col) &&
      !this.isBDen(row, col)
    );
  }
}

const game = new Game();
export { game };
