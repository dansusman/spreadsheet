import { Action } from 'redux';

export interface GridState {
    grid: Cell[][];
    rows: number;
    columns: number;
}

export type GridActions = AddRowAction;

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