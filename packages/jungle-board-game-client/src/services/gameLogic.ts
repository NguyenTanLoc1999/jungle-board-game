import { dequal } from "dequal";
import { klona } from "klona";

export type Board = string[][];

export interface BoardDelta {
  row: number;
  col: number;
}

export interface IState {
  board: Board;
  delta?: BoardDelta;
}

export const ROWS = 9;
export const COLS = 7;

export const BlackTraps: BoardDelta[] = [
  { row: 8, col: 2 },
  { row: 7, col: 3 },
  { row: 8, col: 4 },
];
export const WhiteTraps: BoardDelta[] = [
  { row: 0, col: 2 },
  { row: 1, col: 3 },
  { row: 0, col: 4 },
];

export const BlackDen: BoardDelta = { row: 8, col: 3 };
export const WhiteDen: BoardDelta = { row: 0, col: 3 };

export const RiverPos: BoardDelta[] = [
  { row: 3, col: 1 },
  { row: 3, col: 2 },
  { row: 3, col: 4 },
  { row: 3, col: 5 },
  { row: 4, col: 1 },
  { row: 4, col: 2 },
  { row: 4, col: 4 },
  { row: 4, col: 5 },
  { row: 5, col: 1 },
  { row: 5, col: 2 },
  { row: 5, col: 4 },
  { row: 5, col: 5 },
];

export const PlayerSymbol = {
  B: "B",
  W: "W",
};

export const Structure = {
  Den: "Den",
  Trap: "Trap",
};

export const Animal = {
  Elephant: "Elephant",
  Lion: "Lion",
  Tiger: "Tiger",
  Leopard: "Leopard",
  Wolf: "Wolf",
  Dog: "Dog",
  Cat: "Cat",
  Mouse: "Mouse",
};

export const PieceName = {
  L: "L",
  R: "R",

  BDen: "BDen",
  BTrap: "BTrap",
  BElephant: "BElephant",
  BLion: "BLion",
  BTiger: "BTiger",
  BLeopard: "BLeopard",
  BWolf: "BWolf",
  BDog: "BDog",
  BCat: "BCat",
  BMouse: "BMouse",

  WDen: "WDen",
  WTrap: "WTrap",
  WElephant: "WElephant",
  WLion: "WLion",
  WTiger: "WTiger",
  WLeopard: "WLeopard",
  WWolf: "WWolf",
  WDog: "WDog",
  WCat: "WCat",
  WMouse: "WMouse",
};

const { L, R } = PieceName;
const {
  BDen,
  BTrap,
  BElephant,
  BLion,
  BTiger,
  BLeopard,
  BWolf,
  BDog,
  BCat,
  BMouse,
} = PieceName;
const {
  WDen,
  WTrap,
  WElephant,
  WLion,
  WTiger,
  WLeopard,
  WWolf,
  WDog,
  WCat,
  WMouse,
} = PieceName;

export function getEmptyBoard(): Board {
  return [
    [L, L, WTrap, WDen, WTrap, L, L],
    [L, L, L, WTrap, L, L, L],
    [L, L, L, L, L, L, L],
    [L, R, R, L, R, R, L],
    [L, R, R, L, R, R, L],
    [L, R, R, L, R, R, L],
    [L, L, L, L, L, L, L],
    [L, L, L, BTrap, L, L, L],
    [L, L, BTrap, BDen, BTrap, L, L],
  ];
}

export function getInitialBoard(): Board {
  return [
    [WLion, L, WTrap, WDen, WTrap, L, WTiger],
    [L, WDog, L, WTrap, L, WCat, L],
    [WMouse, L, WLeopard, L, WWolf, L, WElephant],
    [L, R, R, L, R, R, L],
    [L, R, R, L, R, R, L],
    [L, R, R, L, R, R, L],
    [BElephant, L, BWolf, L, BLeopard, L, BMouse],
    [L, BCat, L, BTrap, L, BDog, L],
    [BTiger, L, BTrap, BDen, BTrap, L, BLion],
  ];
}

export function getAnimalLevel(animal: string): number {
  switch (animal) {
    case Animal.Elephant:
      return 7;
    case Animal.Lion:
      return 6;
    case Animal.Tiger:
      return 5;
    case Animal.Leopard:
      return 4;
    case Animal.Dog:
      return 3;
    case Animal.Wolf:
      return 2;
    case Animal.Cat:
      return 1;
    case Animal.Mouse:
      return 0;
    default:
      return -1;
  }
}

export function isOutBoard({ row, col }: BoardDelta): boolean {
  return row < 0 || row >= ROWS || col < 0 || col >= COLS;
}

export function isInRiver(delta: BoardDelta): boolean {
  return !!RiverPos.find((pos) => dequal(pos, delta));
}

export function isInWTrap(delta: BoardDelta): boolean {
  return !!WhiteTraps.find((pos) => dequal(pos, delta));
}

export function isInBTrap(delta: BoardDelta): boolean {
  return !!BlackTraps.find((pos) => dequal(pos, delta));
}

export function isOwnDen(playerTurn: string, delta: BoardDelta): boolean {
  if (playerTurn === PlayerSymbol.B) return dequal(delta, BlackDen);
  if (playerTurn === PlayerSymbol.W) return dequal(delta, WhiteDen);
  return false;
}

/**
 * Return true if the position has no chess piece
 */
export function noChessPiece(board: Board, delta: BoardDelta): boolean {
  const { L, R, BTrap, WTrap, BDen, WDen } = PieceName;
  const piece = board[delta.row][delta.col];
  return [L, R, BTrap, WTrap, BDen, WDen].includes(piece);
}

/**
 * Return true if the position has player's own chess piece
 */
export function isOwnChessPiece(
  board: Board,
  playerTurn: string,
  delta: BoardDelta
): boolean {
  if (noChessPiece(board, delta)) return false;

  const { row, col } = delta;
  const piece = board[row][col];
  const isWhiteChessPiece =
    playerTurn === PlayerSymbol.W && piece.charAt(0) === PlayerSymbol.W;
  const isBlackChessPiece =
    playerTurn === PlayerSymbol.B && piece.charAt(0) === PlayerSymbol.B;
  return isWhiteChessPiece || isBlackChessPiece;
}

export function isOwnTrap(playerTurn: string, delta: BoardDelta): boolean {
  if (playerTurn === PlayerSymbol.B) {
    return !!BlackTraps.find((trap) => dequal(trap, delta));
  }

  if (playerTurn === PlayerSymbol.W) {
    return !!WhiteTraps.find((trap) => dequal(trap, delta));
  }

  return false;
}

/**
 * Return true if there's a mouse in the river when lion or tiger wants to fly through
 */
export function isMouseOnWay(
  board: Board,
  deltaFrom: BoardDelta,
  deltaTo: BoardDelta
): boolean {
  // horizontal line
  if (deltaFrom.row === deltaTo.row) {
    let riverCol1;
    let riverCol2;
    // player's chess is being on left side of the river
    if (deltaFrom.col < deltaTo.col) {
      riverCol1 = board[deltaFrom.row][deltaFrom.col + 1];
      riverCol2 = board[deltaFrom.row][deltaFrom.col + 2];
    } else {
      // right side
      riverCol1 = board[deltaFrom.row][deltaFrom.col - 1];
      riverCol2 = board[deltaFrom.row][deltaFrom.col - 2];
    }

    return (
      riverCol1.substring(1) === Animal.Mouse ||
      riverCol2.substring(1) === Animal.Mouse
    );
  }

  // vertical line
  let riverRow1;
  let riverRow2;
  let riverRow3;
  // player's chess is being on top of the river
  if (deltaFrom.row < deltaTo.row) {
    riverRow1 = board[deltaFrom.row + 1][deltaFrom.col];
    riverRow2 = board[deltaFrom.row + 2][deltaFrom.col];
    riverRow3 = board[deltaFrom.row + 3][deltaFrom.col];
  } else {
    riverRow1 = board[deltaFrom.row - 1][deltaFrom.col];
    riverRow2 = board[deltaFrom.row - 2][deltaFrom.col];
    riverRow3 = board[deltaFrom.row - 3][deltaFrom.col];
  }

  return (
    riverRow1.substring(1) === Animal.Mouse ||
    riverRow2.substring(1) === Animal.Mouse ||
    riverRow3.substring(1) === Animal.Mouse
  );
}

/**
 * Return true if can move (for final compare)
 */
export function canMoveHelper(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta,
  deltaTo: BoardDelta
): boolean {
  // can move if there are no chess pieces on next move
  if (noChessPiece(board, deltaTo)) return true;

  // cannot move if there are player's own chess pieces on next move
  if (isOwnChessPiece(board, playerTurn, deltaTo)) return false;

  /**
   * there are two cases that player's chess can move
   * 1. opponent's chess is on player's own trap
   * 2. higher animal level can beat lower animal level
   * 3. elephant and mouse is special case (mouse beats elephant)
   */

  // opponent's chess is on player's own trap
  if (isOwnTrap(playerTurn, deltaTo)) return true;

  const playerPiece = board[deltaFrom.row][deltaFrom.col];
  const opponentPiece = board[deltaTo.row][deltaTo.col];

  const playerPieceLevel = getAnimalLevel(playerPiece.substring(1));
  const opponentPieceLevel = getAnimalLevel(opponentPiece.substring(1));
  const elephantLevel = getAnimalLevel(Animal.Elephant);
  const mouseLevel = getAnimalLevel(Animal.Mouse);

  // higher animal level can beat lower animal level
  if (playerPieceLevel >= opponentPieceLevel) {
    // special case
    if (
      playerPieceLevel === elephantLevel &&
      opponentPieceLevel === mouseLevel
    ) {
      return false;
    }
    return true;
  } else {
    // playerPieceLevel < opponentPieceLevel
    if (
      playerPieceLevel === mouseLevel &&
      opponentPieceLevel === elephantLevel
    ) {
      return !isInRiver(deltaFrom); // but the mouse is in river cannot beat the elephant
    }
    return false;
  }
}

export function canLandAnimalMove(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta,
  deltaTo: BoardDelta
): boolean {
  if (
    isOutBoard(deltaTo) ||
    isInRiver(deltaTo) ||
    isOwnDen(playerTurn, deltaTo) ||
    dequal(deltaFrom, deltaTo)
  ) {
    return false;
  }

  return canMoveHelper(board, playerTurn, deltaFrom, deltaTo);
}

export function canFlyAnimalMove(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta,
  deltaTo: BoardDelta
): boolean {
  if (
    isOutBoard(deltaTo) ||
    isInRiver(deltaTo) ||
    isOwnDen(playerTurn, deltaTo) ||
    dequal(deltaFrom, deltaTo)
  ) {
    return false;
  }

  return canMoveHelper(board, playerTurn, deltaFrom, deltaTo);
}

export function canSwimAnimalMove(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta,
  deltaTo: BoardDelta
): boolean {
  if (
    isOutBoard(deltaTo) ||
    isOwnDen(playerTurn, deltaTo) ||
    dequal(deltaFrom, deltaTo)
  ) {
    return false;
  }

  return canMoveHelper(board, playerTurn, deltaFrom, deltaTo);
}

export function getLandAnimalPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  const possibleMoves: BoardDelta[] = [];

  const moveUp: BoardDelta = { row: deltaFrom.row - 1, col: deltaFrom.col };
  if (canLandAnimalMove(board, playerTurn, deltaFrom, moveUp)) {
    possibleMoves.push(moveUp);
  }

  const moveDown: BoardDelta = { row: deltaFrom.row + 1, col: deltaFrom.col };
  if (canLandAnimalMove(board, playerTurn, deltaFrom, moveDown)) {
    possibleMoves.push(moveDown);
  }

  const moveLeft: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col - 1 };
  if (canLandAnimalMove(board, playerTurn, deltaFrom, moveLeft)) {
    possibleMoves.push(moveLeft);
  }

  const moveRight: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col + 1 };
  if (canLandAnimalMove(board, playerTurn, deltaFrom, moveRight)) {
    possibleMoves.push(moveRight);
  }

  return possibleMoves;
}

export function getFlyAnimalPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  const possibleMoves: BoardDelta[] = [];

  const moveUp: BoardDelta = { row: deltaFrom.row - 1, col: deltaFrom.col };
  if (isInRiver(moveUp)) {
    // a mouse is not on the way, can fly through
    if (!isMouseOnWay(board, deltaFrom, moveUp)) {
      moveUp.row = moveUp.row - 3;
      if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveUp)) {
        possibleMoves.push(moveUp);
      }
    }
  } else {
    if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveUp)) {
      possibleMoves.push(moveUp);
    }
  }

  const moveDown: BoardDelta = { row: deltaFrom.row + 1, col: deltaFrom.col };
  if (isInRiver(moveDown)) {
    if (!isMouseOnWay(board, deltaFrom, moveDown)) {
      moveDown.row = moveDown.row + 3;
      if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveDown)) {
        possibleMoves.push(moveDown);
      }
    }
  } else {
    if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveDown)) {
      possibleMoves.push(moveDown);
    }
  }

  const moveLeft: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col - 1 };
  if (isInRiver(moveLeft)) {
    if (!isMouseOnWay(board, deltaFrom, moveLeft)) {
      moveLeft.col = moveLeft.col - 2;
      if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveLeft)) {
        possibleMoves.push(moveLeft);
      }
    }
  } else {
    if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveLeft)) {
      possibleMoves.push(moveLeft);
    }
  }

  const moveRight: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col + 1 };
  if (isInRiver(moveRight)) {
    if (!isMouseOnWay(board, deltaFrom, moveRight)) {
      moveRight.col = moveRight.col + 2;
      if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveRight)) {
        possibleMoves.push(moveRight);
      }
    }
  } else {
    if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveRight)) {
      possibleMoves.push(moveRight);
    }
  }

  return possibleMoves;
}

export function getSwimPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  const possibleMoves: BoardDelta[] = [];

  const moveUp: BoardDelta = { row: deltaFrom.row - 1, col: deltaFrom.col };
  if (canSwimAnimalMove(board, playerTurn, deltaFrom, moveUp)) {
    possibleMoves.push(moveUp);
  }

  const moveDown: BoardDelta = { row: deltaFrom.row + 1, col: deltaFrom.col };
  if (canSwimAnimalMove(board, playerTurn, deltaFrom, moveDown)) {
    possibleMoves.push(moveDown);
  }

  const moveLeft: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col - 1 };
  if (canSwimAnimalMove(board, playerTurn, deltaFrom, moveLeft)) {
    possibleMoves.push(moveLeft);
  }

  const moveRight: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col + 1 };
  if (canSwimAnimalMove(board, playerTurn, deltaFrom, moveRight)) {
    possibleMoves.push(moveRight);
  }

  return possibleMoves;
}

export function getElephantPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom);
}

export function getLionPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  return getFlyAnimalPossibleMoves(board, playerTurn, deltaFrom);
}

export function getTigerPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  return getFlyAnimalPossibleMoves(board, playerTurn, deltaFrom);
}

export function getLeopardPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom);
}

export function getWolfPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom);
}

export function getDogPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom);
}

export function getCatPossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom);
}

export function getMousePossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  return getSwimPossibleMoves(board, playerTurn, deltaFrom);
}

export function getPiecePossibleMoves(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta
): BoardDelta[] {
  if (!board) return [];

  const piece = board[deltaFrom.row][deltaFrom.col];
  switch (piece.substring(1)) {
    case Animal.Elephant:
      return getElephantPossibleMoves(board, playerTurn, deltaFrom);
    case Animal.Lion:
      return getLionPossibleMoves(board, playerTurn, deltaFrom);
    case Animal.Tiger:
      return getTigerPossibleMoves(board, playerTurn, deltaFrom);
    case Animal.Leopard:
      return getLeopardPossibleMoves(board, playerTurn, deltaFrom);
    case Animal.Wolf:
      return getWolfPossibleMoves(board, playerTurn, deltaFrom);
    case Animal.Dog:
      return getDogPossibleMoves(board, playerTurn, deltaFrom);
    case Animal.Cat:
      return getCatPossibleMoves(board, playerTurn, deltaFrom);
    case Animal.Mouse:
      return getMousePossibleMoves(board, playerTurn, deltaFrom);
    default:
      return [];
  }
}

export function getWinner(board: Board): string {
  // W win
  if (board[BlackDen.row][BlackDen.col] !== PieceName.BDen) {
    return PlayerSymbol.W;
  }

  // B win
  if (board[WhiteDen.row][WhiteDen.col] !== PieceName.WDen) {
    return PlayerSymbol.B;
  }

  return "";
}

export function makeMove(
  board: Board,
  deltaFrom: BoardDelta,
  deltaTo: BoardDelta
) {
  const prevBoard = klona(board);
  const nextBoard = klona(board);

  const pieceFrom = board[deltaFrom.row][deltaFrom.col];
  const isRiver = isInRiver(deltaFrom);
  const isWTrap = isInWTrap(deltaFrom);
  const isBTrap = isInBTrap(deltaFrom);
  const pieceReplaceFrom = isBTrap
    ? PieceName.BTrap
    : isWTrap
    ? PieceName.WTrap
    : isRiver
    ? PieceName.R
    : PieceName.L;

  nextBoard[deltaFrom.row][deltaFrom.col] = pieceReplaceFrom;
  nextBoard[deltaTo.row][deltaTo.col] = pieceFrom;

  const winner = getWinner(nextBoard);

  return {
    prevBoard,
    nextBoard,
    winner,
  };
}
