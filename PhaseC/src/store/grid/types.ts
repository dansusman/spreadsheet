import { Action } from "redux";

/**
 * The state of the grid of cells, comprising the
 * 2D array of Cells, the size of the grid (rows by columns),
 * the undoStack of actions that can be undone, and the redoStack
 * of actions that can be redone.
 */
export interface GridState {
    grid: Cell[][];
    rows: number;
    columns: number;
    undoStack: GridHistory[];
    redoStack: GridHistory[];
}

/**
 * A snapshot in the history of the grid, which
 * holds what the whole grid looked like (all Cells at
 * that point in time), and the size of the grid at that
 * time (rows by columns).
 */
export interface GridHistory {
    grid: Cell[][];
    rows: number;
    columns: number;
}

/**
 * The Cell, core to our spreadsheet, which
 * holds some text content (possibly empty string) and
 * has some color.
 */
export interface Cell {
    content: string;
    color: string;
}

/**
 * The AddRowAction, which is used to update the Redux store by
 * adding a new row of empty Cells.
 */
export interface AddRowAction extends Action {
    type: "@@grid/ADD_ROW";
    payload: {
        grid: Cell[][];
        rows: number;
        undoStack: GridHistory[];
    };
}

/**
 * The AddColumnAction, which is used to update the Redux store by
 * adding a new column of empty Cells.
 */
export interface AddColumnAction extends Action {
    type: "@@grid/ADD_COLUMN";
    payload: {
        grid: Cell[][];
        columns: number;
        undoStack: GridHistory[];
    };
}

/**
 * The DeleteRowAction, which is used to update the Redux store by
 * deleting an existing row from the Redux store.
 */
export interface DeleteRowAction extends Action {
    type: "@@grid/DELETE_ROW";
    payload: {
        grid: Cell[][];
        rows: number;
        undoStack: GridHistory[];
    };
}

/**
 * The DeleteColumnAction, which is used to update the Redux store by
 * deleting an existing column from the Redux store.
 */
export interface DeleteColumnAction extends Action {
    type: "@@grid/DELETE_COLUMN";
    payload: {
        grid: Cell[][];
        columns: number;
        undoStack: GridHistory[];
    };
}

/**
 * The UndoAction, which is used to update the Redux store by undoing
 * an action previously applied to the store.
 */
export interface UndoAction extends Action {
    type: "@@grid/UNDO";
    payload: {
        state: GridState;
    };
}

/**
 * The RedoAction, which is used to update the Redux store by redoing
 * a previously undone action.
 */
export interface RedoAction extends Action {
    type: "@@grid/REDO";
    payload: {
        state: GridState;
    };
}

/**
 * The ReplaceContentAction, which is used to update the Redux store by
 * replacing the text content of a specific Cell.
 */
export interface ReplaceContentAction extends Action {
    type: "@@grid/REPLACE_CONTENT";
    payload: {
        grid: Cell[][];
        undoStack: GridHistory[];
    };
}

/**
 * The FillCellAction, which is used to update the Redux store by
 * replacing the color of a specific Cell.
 */
export interface FillCellAction extends Action {
    type: "@@grid/FILL_CELL";
    payload: {
        grid: Cell[][];
        undoStack: GridHistory[];
    };
}

export type GridActions =
    | AddRowAction
    | AddColumnAction
    | DeleteRowAction
    | DeleteColumnAction
    | UndoAction
    | RedoAction
    | ReplaceContentAction
    | FillCellAction;
