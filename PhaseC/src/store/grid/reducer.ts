import { Reducer } from 'redux';
import { GridState, GridActions, Cell } from './types';

const numRows: number = 1;
const numColumns: number = 2;

const makeCells = () => {
  var grid : Cell[][] = [];
  for (let row = 0; row < numRows; row++) {
      var r : Cell[] = [];
    for (let col = 0; col < numColumns; col++) {
      r = [...r, {content : "", color : "WHITE"}]
    }
    grid = [...grid, r];
  }
  return grid;
}

// Type-safe initialState!
export const initialState: GridState = {
  grid: makeCells(),
  rows: numRows,
  columns: numColumns
};

// Unfortunately, typing of the `action` parameter seems to be broken at the moment.
// This should be fixed in Redux 4.x, but for now, just augment your types.

const reducer: Reducer<GridState> = (state: GridState = initialState, action) => {
  // We'll augment the action type on the switch case to make sure we have
  // all the cases handled.
  switch ((action as GridActions).type) {
    case '@@grid/ADD_ROW':
      return { ...state, grid: action.payload.grid, rows: action.payload.rows };
    case '@@grid/ADD_COLUMN':
      return { ...state, grid: action.payload.grid, columns: action.payload.columns };
    case '@@grid/DELETE_ROW':
      return { ...state, grid: action.payload.grid, rows: action.payload.rows };
    default:
      return state;
  }
};

export default reducer;