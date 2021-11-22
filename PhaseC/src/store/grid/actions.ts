import { ActionCreator } from 'redux';
import {
  AddRowAction,
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
    const new_grid = [...state.grid.slice(0, row+1), r, ...state.grid.slice(row+1)];
  
  return {type: '@@grid/ADD_ROW',
  payload: {
    grid : new_grid,
    rows : state.rows + 1
  }}
};
