import { Reducer } from 'redux';
import { GridState, GridActions, Cell } from './types';

const makeCells = () => {
    var grid : Cell[][] = [];
    for (let row = 0; row < 1; row++) {
        var r : Cell[] = [];
        for(let col = 0; col < 11; col++) {
            r = [...r, {content : "", color : "WHITE"}]
        }
        grid = [...grid, r];
    }
    return grid;
}

// Type-safe initialState!
export const initialState: GridState = {
    grid: makeCells(),
    rows: 1,
    columns: 11
};

// Unfortunately, typing of the `action` parameter seems to be broken at the moment.
// This should be fixed in Redux 4.x, but for now, just augment your types.

const reducer: Reducer<GridState> = (state: GridState = initialState, action) => {
  // We'll augment the action type on the switch case to make sure we have
  // all the cases handled.
  switch ((action as GridActions).type) {
    case '@@grid/ADD_ROW':
      return { ...state, grid: action.payload.grid, rows: action.payload.rows };
    default:
      return state;
  }
};

export default reducer;