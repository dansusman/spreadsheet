import { Action } from 'redux';

export interface GridState {
    grid: Cell[][];
    rows: number;
    columns: number;
}

export interface Cell {
    content: string //| Expression;
    color: string;
}

export interface AddRowAction extends Action{
    type: '@@grid/ADD_ROW';
    payload: {
        grid: Cell[][],
        rows: number;
    }
}

export interface AddColumnAction extends Action {
    type: '@@grid/ADD_COLUMN';
    payload: {
        grid: Cell[][],
        columns: number;
    }
}

export interface DeleteRowAction extends Action {
    type: '@@grid/DELETE_ROW';
    payload: {
        grid: Cell[][],
        rows: number;
    }
}

export type GridActions = AddRowAction | AddColumnAction | DeleteRowAction;