import { combineReducers, Reducer } from 'redux';

// Import your state types and reducers here.
import { GridState } from './grid/types';
import gridReducer from './grid/reducer';
// The top-level state object
export interface ApplicationState {
  grid: GridState;
}

export const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({
  grid: gridReducer,
});