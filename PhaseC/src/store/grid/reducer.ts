import { Reducer } from "redux";
import { Cell, GridActions, GridState } from "./types";

const NUM_ROWS: number = 15;
const NUM_COLUMNS: number = 8;

/**
 * Makes a grid of empty cells with color WHITE and content = ""
 * @returns a 2D array of Cell Objects, all empty
 */
export const makeCells: () => Cell[][] = () => {
    var grid: Cell[][] = [];
    for (let row = 0; row < NUM_ROWS; row++) {
        var r: Cell[] = [];
        for (let col = 0; col < NUM_COLUMNS; col++) {
            r = [...r, { content: "", color: "WHITE" }];
        }
        grid = [...grid, r];
    }
    return grid;
};

/**
 * Type-safe initial state of the Grid, with fully
 * empty cells and of size rows by columns. Initially,
 * the undoStack and redoStack are empty.
 */
export const initialState: GridState = {
    grid: makeCells(),
    rows: NUM_ROWS,
    columns: NUM_COLUMNS,
    redoStack: [],
    undoStack: [],
};

/**
 * The reducer for GridState.
 * @param state the state of the whole grid of cells, initially
 * set to empty cells with empty undoStack and redoStack
 * @param action the action to perform on the Redux store
 * @returns
 */
const reducer: Reducer<GridState> = (
    state: GridState = initialState,
    action
) => {
    // switch statement over the type of action to perform
    switch ((action as GridActions).type) {
        case "@@grid/ADD_ROW":
            // perform add row action
            return {
                ...state,
                grid: action.payload.grid,
                rows: action.payload.rows,
                redoStack: [],
                undoStack: action.payload.undoStack,
            };
        case "@@grid/ADD_COLUMN":
            // perform add column action
            return {
                ...state,
                grid: action.payload.grid,
                columns: action.payload.columns,
                redoStack: [],
                undoStack: action.payload.undoStack,
            };
        case "@@grid/DELETE_ROW":
            // perform delete row action
            return {
                ...state,
                grid: action.payload.grid,
                rows: action.payload.rows,
                redoStack: [],
                undoStack: action.payload.undoStack,
            };
        case "@@grid/DELETE_COLUMN":
            // perform delete column action
            return {
                ...state,
                grid: action.payload.grid,
                columns: action.payload.columns,
                redoStack: [],
                undoStack: action.payload.undoStack,
            };
        case "@@grid/UNDO":
            // perform undo action
            return {
                ...state,
                ...action.payload.state,
            };
        case "@@grid/REDO":
            // perform redo action
            return {
                ...state,
                ...action.payload.state,
            };
        case "@@grid/REPLACE_CONTENT":
            // perform replace text content action
            return {
                ...state,
                grid: action.payload.grid,
                undoStack: action.payload.undoStack,
                redoStack: [],
            };
        case "@@grid/FILL_CELL":
            // perform fill cell with color action
            return {
                ...state,
                grid: action.payload.grid,
                undoStack: action.payload.undoStack,
                redoStack: [],
            };
        default:
            return state;
    }
};

export default reducer;
