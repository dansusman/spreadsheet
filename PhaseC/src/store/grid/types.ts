import { Action } from "redux";

export interface GridState {
    grid: Cell[][];
    rows: number;
    columns: number;
    undoStack: GridHistory[];
    redoStack: GridHistory[];
}

export interface GridHistory {
    grid: Cell[][];
    rows: number;
    columns: number;
}

export interface Cell {
    content: string; //| Expression;
    color: string;
}

export interface AddRowAction extends Action {
    type: "@@grid/ADD_ROW";
    payload: {
        grid: Cell[][];
        rows: number;
        undoStack: GridHistory[];
    };
}

export interface AddColumnAction extends Action {
    type: "@@grid/ADD_COLUMN";
    payload: {
        grid: Cell[][];
        columns: number;
        undoStack: GridHistory[];
    };
}

export interface DeleteRowAction extends Action {
    type: "@@grid/DELETE_ROW";
    payload: {
        grid: Cell[][];
        rows: number;
        undoStack: GridHistory[];
    };
}

export interface DeleteColumnAction extends Action {
    type: "@@grid/DELETE_COLUMN";
    payload: {
        grid: Cell[][];
        columns: number;
        undoStack: GridHistory[];
    };
}

export interface UndoAction extends Action {
    type: "@@grid/UNDO";
    payload: {
        state: GridState;
    };
}

export interface RedoAction extends Action {
    type: "@@grid/REDO";
    payload: {
        state: GridState;
    };
}

export type GridActions =
    | AddRowAction
    | AddColumnAction
    | DeleteRowAction
    | DeleteColumnAction
    | UndoAction
    | RedoAction;
