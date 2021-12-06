import React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { Cell } from "../../store/grid/types";
import { SelectedCell } from "../../types";
import { getColHeaders } from "../../util/gridCoords";
import "./Grid.css";
import GridCell from "./gridCell";

/**
 * Properties for the Grid React Component.
 */
interface Props {
    setSelectedCell: (s: SelectedCell | null) => void;
}

/**
 * The Grid React Functional Component, which comprises
 * a bunch of GridCell objects and the header row and column.
 */
const Grid: React.FC<Props> = ({ setSelectedCell }) => {
    // Grab the state of the whole grid from the Redux store
    const grid: Cell[][] = useSelector(
        (state: ApplicationState) => state.grid.grid
    );
    // Grab the number of columns from Redux store
    const columns: number = useSelector(
        (state: ApplicationState) => state.grid.columns
    );
    const colHeaders = getColHeaders(columns);
    return (
        <div className="grid">
            <div className="headerRow">
                <div className="header rowHeader" />
                {colHeaders.map((header: string) => (
                    <div className="header colHeader" key={header}>
                        {header}
                    </div>
                ))}
            </div>
            {grid.map((row, rowKey) => (
                <div className="row" key={rowKey}>
                    <div className="header rowHeader stickLeft">
                        {rowKey + 1}
                    </div>
                    {row.map((cell, cellKey) => (
                        <GridCell
                            cell={cell}
                            col={cellKey}
                            row={rowKey}
                            key={`${rowKey} + ${cellKey}`}
                            setSelectedCell={setSelectedCell}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Grid;
