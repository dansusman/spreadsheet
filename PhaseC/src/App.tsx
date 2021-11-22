import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from './store'
import { addRow } from './store/grid/actions'

function App() {
  const dispatch = useDispatch();
  const grid = useSelector((state : ApplicationState) => state.grid)

  const test = () => {
    dispatch(addRow(grid, 0))
  }
  return (
    <div>
      <div onClick={test}>Click Me</div>
      {JSON.stringify(grid)}
    </div>
  );
}

export default App;
