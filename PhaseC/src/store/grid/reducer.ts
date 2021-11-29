import { Reducer } from "redux";
import { GridState, GridActions, Cell } from "./types";

const NUM_ROWS: number = 25;
const NUM_COLUMNS: number = 40;

const makeCells = () => {
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

// Type-safe initialState!
export const initialState: GridState = {
    grid: makeCells(),
    rows: NUM_ROWS,
    columns: NUM_COLUMNS,
    redoStack: [],
    undoStack: [],
};

// Unfortunately, typing of the `action` parameter seems to be broken at the moment.
// This should be fixed in Redux 4.x, but for now, just augment your types.

const reducer: Reducer<GridState> = (
    state: GridState = initialState,
    action
) => {
    // We'll augment the action type on the switch case to make sure we have
    // all the cases handled.
    switch ((action as GridActions).type) {
        case "@@grid/ADD_ROW":
            return {
                ...state,
                grid: action.payload.grid,
                rows: action.payload.rows,
                redoStack: [],
                undoStack: action.payload.undoStack,
            };
        case "@@grid/ADD_COLUMN":
            return {
                ...state,
                grid: action.payload.grid,
                columns: action.payload.columns,
                redoStack: [],
                undoStack: action.payload.undoStack,
            };
        case "@@grid/DELETE_ROW":
            return {
                ...state,
                grid: action.payload.grid,
                rows: action.payload.rows,
                redoStack: [],
                undoStack: action.payload.undoStack,
            };
        case "@@grid/DELETE_COLUMN":
            return {
                ...state,
                grid: action.payload.grid,
                columns: action.payload.columns,
                redoStack: [],
                undoStack: action.payload.undoStack,
            };
        case "@@grid/UNDO":
            return {
                ...state,
                ...action.payload.state,
            };
        case "@@grid/REDO":
            return {
                ...state,
                ...action.payload.state,
            };
        case "@@grid/REPLACE_CONTENT":
            return {
                ...state,
                grid: action.payload.grid,
                undoStack: action.payload.undoStack,
                redoStack: [],
            };
        case "@@grid/FILL_CELL":
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
