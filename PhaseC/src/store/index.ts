import { combineReducers, Reducer } from "redux";
import gridReducer from "./grid/reducer";
import { GridState } from "./grid/types";

/**
 * The top-level state object
 */
export interface ApplicationState {
    grid: GridState;
}
/**
 * The reducers used for updating the Redux store.
 */
export const reducers: Reducer<ApplicationState> =
    combineReducers<ApplicationState>({
        grid: gridReducer,
    });
