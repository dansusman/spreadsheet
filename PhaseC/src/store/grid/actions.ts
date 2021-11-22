 import { ActionCreator } from 'redux';
import {
  AddRowAction,
  AddColumnAction,
  DeleteRowAction,
  GridState,
  Cell
} from './types';

// Type these action creators with `: ActionCreator<ActionTypeYouWantToPass>`.
// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly.


export const addRow: ActionCreator<AddRowAction> = (state: GridState, row: number) => {
    var r : Cell[] = [];
    for(let col = 0; col < state.columns; col++) {
        r = [...r, {content : "", color : "WHITE"}]
    }
    const new_grid = [...state.grid.slice(0, row), r, ...state.grid.slice(row)]; // [...state.grid.slice(0, row + 1), r, ...state.grid.slice(row + 1)];
  
  return {
    type: '@@grid/ADD_ROW',
    payload: {
      grid : new_grid,
      rows : state.rows++
    }
  }
};

export const addColumn: ActionCreator<AddColumnAction> = (state: GridState, col: number) => {
  var c: Cell[] = [];
  for (let row = 0; row < state.rows; row++) {
    c = [...c, { content: "", color: "WHITE" }]
  }
  const new_grid = [...state.grid.slice(0, col), c, ...state.grid.slice(col)];

  return {
    type: '@@grid/ADD_COLUMN',
    payload: {
      grid: new_grid,
      columns: state.columns++
    }
  }
};

export const deleteRow: ActionCreator<DeleteRowAction> = (state: GridState, row: number) => {
  const new_grid = [...state.grid.slice(0, row), ...state.grid.slice(row + 1)];

  return {
    type: '@@grid/DELETE_ROW',
    payload: {
      grid: new_grid,
      rows: state.rows--
    }
  }
};