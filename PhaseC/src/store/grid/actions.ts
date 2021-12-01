import { ActionCreator } from "redux";
import {
  AddRowAction,
  AddColumnAction,
  DeleteRowAction,
  GridState,
  Cell,
  DeleteColumnAction,
  UndoAction,
  RedoAction,
  ReplaceContentAction,
  FillCellAction,
} from "./types";

export const addRow: ActionCreator<AddRowAction> = (
  state: GridState,
  row: number
) => {
  var r: Cell[] = [];
  for (let col = 0; col < state.columns; col++) {
    r = [...r, { content: "", color: "WHITE" }];
  }
  const new_grid = [...state.grid.slice(0, row), r, ...state.grid.slice(row)];

  return {
    type: "@@grid/ADD_ROW",
    payload: {
      grid: new_grid,
      rows: state.rows + 1,
      undoStack: [
        ...state.undoStack,
        { grid: state.grid, columns: state.columns, rows: state.rows },
      ].slice(-4),
    },
  };
};

export const deleteRow: ActionCreator<DeleteRowAction> = (
  state: GridState,
  row: number
) => {
  if (state.rows === 1) {
    return {
      type: "@@grid/DELETE_ROW",
      payload: {
        grid: state.grid,
        rows: state.rows,
        undoStack: state.undoStack,
      },
    };
  }
  const new_grid = [
    ...state.grid.slice(0, row + 1),
    ...state.grid.slice(row + 2),
  ];

  return {
    type: "@@grid/DELETE_ROW",
    payload: {
      grid: new_grid,
      rows: state.rows - 1,
      undoStack: [
        ...state.undoStack,
        { grid: state.grid, columns: state.columns, rows: state.rows },
      ].slice(-4),
    },
  };
};

export const addColumn: ActionCreator<AddColumnAction> = (
  state: GridState,
  col: number
) => {
  var newGrid: Cell[][] = [];
  for (let row = 0; row < state.rows; row++) {
    const newRow = [
      ...state.grid[row].slice(0, row),
      { content: "", color: "WHITE" },
      ...state.grid[row].slice(row),
    ];
    newGrid = [...newGrid, newRow];
  }
  return {
    type: "@@grid/ADD_COLUMN",
    payload: {
      grid: newGrid,
      columns: state.columns + 1,
      undoStack: [
        ...state.undoStack,
        { grid: state.grid, columns: state.columns, rows: state.rows },
      ].slice(-4),
    },
  };
};

export const deleteColumn: ActionCreator<DeleteColumnAction> = (
  state: GridState,
  col: number
) => {
  if (state.columns === 1) {
    return {
      type: "@@grid/DELETE_COLUMN",
      payload: {
        grid: state.grid,
        columns: state.columns,
        undoStack: state.undoStack,
      },
    };
  }
  var newGrid: Cell[][] = [];
  for (let row = 0; row < state.rows; row++) {
    const newRow = [
      ...state.grid[row].slice(0, col),
      ...state.grid[row].slice(col + 1),
    ];
    newGrid = [...newGrid, newRow];
  }

  return {
    type: "@@grid/DELETE_COLUMN",
    payload: {
      grid: newGrid,
      columns: state.columns - 1,
      undoStack: [
        ...state.undoStack,
        { grid: state.grid, columns: state.columns, rows: state.rows },
      ].slice(-4),
    },
  };
};

export const undo: ActionCreator<UndoAction> = (state: GridState) => {
  if (state.undoStack.length < 1) {
    return {
      type: "@@grid/UNDO",
      payload: {
        state,
      },
    };
  }
  const oldState = state.undoStack[state.undoStack.length - 1];
  const newUndo = state.undoStack.slice(0, -1);
  return {
    type: "@@grid/UNDO",
    payload: {
      state: {
        ...oldState,
        redoStack: [...state.redoStack, state],
        undoStack: newUndo,
      },
    },
  };
};

export const redo: ActionCreator<RedoAction> = (state: GridState) => {
  if (state.redoStack.length < 1) {
    return {
      type: "@@grid/REDO",
      payload: {
        state,
      },
    };
  }
  const oldState = state.redoStack[state.redoStack.length - 1];
  const newRedo = state.redoStack.slice(0, -1);

  return {
    type: "@@grid/REDO",
    payload: {
      state: {
        ...oldState,
        undoStack: [...state.undoStack, state],
        redoStack: newRedo,
      },
    },
  };
};

export const replaceContent: ActionCreator<ReplaceContentAction> = (
  state: GridState,
  content: string,
  rowNum: number,
  colNum: number
) => {
  const newGrid = JSON.parse(JSON.stringify(state.grid));
  const cell = newGrid[rowNum][colNum];
  newGrid[rowNum][colNum] = { ...cell, content };

  return {
    type: "@@grid/REPLACE_CONTENT",
    payload: {
      grid: newGrid,
      undoStack: [
        ...state.undoStack,
        { grid: state.grid, columns: state.columns, rows: state.rows },
      ].slice(-4),
    },
  };
};

export const fillCell: ActionCreator<FillCellAction> = (
  state: GridState,
  newColor: string,
  rowNum: number,
  colNum: number
) => {
  const newGrid = JSON.parse(JSON.stringify(state.grid));
  const cell = newGrid[rowNum][colNum];
  newGrid[rowNum][colNum] = { ...cell, color: newColor };

  return {
    type: "@@grid/FILL_CELL",
    payload: {
      grid: newGrid,
      undoStack: [
        ...state.undoStack,
        { grid: state.grid, columns: state.columns, rows: state.rows },
      ].slice(-4),
    },
  };
};
