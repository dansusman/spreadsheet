import { ActionCreator } from "redux";
import {
    AddColumnAction,
    AddRowAction,
    Cell,
    DeleteColumnAction,
    DeleteRowAction,
    FillCellAction,
    GridState,
    RedoAction,
    ReplaceContentAction,
    UndoAction,
} from "./types";

/**
 * Adds a new row of empty cells above the row at the given location.
 * @param state the current state of the Redux Store
 * @param row the row above which to add a new row
 */
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
            ].slice(-2),
        },
    };
};

/**
 * Deletes the row found at the given location.
 * @param state the current state of the Redux store
 * @param row the row to delete from the store
 */
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
        ...state.grid.slice(0, row),
        ...state.grid.slice(row + 1),
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

/**
 * Adds a new column of empty cells left of the given location.
 * @param state the current state of the Redux store
 * @param col the column number left of which to add a new column
 */
export const addColumn: ActionCreator<AddColumnAction> = (
    state: GridState,
    col: number
) => {
    var newGrid: Cell[][] = [];
    for (let row = 0; row < state.rows; row++) {
        const newRow = [
            ...state.grid[row].slice(0, col),
            { content: "", color: "WHITE" },
            ...state.grid[row].slice(col),
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
            ].slice(-2),
        },
    };
};

/**
 * Deletes the column at the given location from the store.
 * @param state the current state of the Redux store
 * @param col the column to delete
 */
export const deleteColumn: ActionCreator<DeleteColumnAction> = (
    state: GridState,
    col: number
) => {
    // disallow removing the one and only column (always require there
    // to be at least one column in the grid)
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
            ].slice(-2),
        },
    };
};

/**
 * Undoes the previous action to the Redux store.
 * @param state the current state of the Redux store
 */
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

/**
 * Redoes the previously undone action and applies to the Redux store.
 * @param state the current state of the Redux store
 */
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

/**
 * Replaces the text content of the cell with the specified coordinates
 * to have the given content.
 * @param state the current state of the Redux store
 * @param content the contents to add to the cell
 * @param rowNum the row of the cell to update
 * @param colNum the column of the cell to update
 */
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
            ].slice(-2),
        },
    };
};

/**
 * Replaces the color of the cell with the specified coordinates
 * to have the given color.
 * @param state the current state of the Redux store
 * @param newColor the desired new color for the cell
 * @param rowNum the row of the cell to update
 * @param colNum the column of the cell to update
 */
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
