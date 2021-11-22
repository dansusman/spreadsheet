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
    const new_grid = [...state.grid.slice(0, row), r, ...state.grid.slice(row)];
  
  return {
    type: '@@grid/ADD_ROW',
    payload: {
      grid : new_grid,
      rows : state.rows + 1
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
      columns: state.columns + 1
    }
  }
};

export const deleteRow: ActionCreator<DeleteRowAction> = (state: GridState, row: number) => {
  if (state.rows === 1) {
    return {
      type: '@@grid/DELETE_ROW',
      payload: {
        grid: state.grid,
        rows: state.rows 
      }
    }
  }
  const new_grid = [...state.grid.slice(0, row), ...state.grid.slice(row + 1)];

  return {
    type: '@@grid/DELETE_ROW',
    payload: {
      grid: new_grid,
      rows: state.rows - 1
    }
  }
};
