import React from "react";
import { Cell } from "../../store/grid/types";
import GridCell from "./gridCell";
import "./Grid.css";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { SelectedCell } from "../../types";
import { getColHeaders } from "../../util/gridCoords";

interface Props {
    setSelectedCell: (s: SelectedCell | null) => void;
}

const Grid: React.FC<Props> = ({ setSelectedCell }) => {
    const grid: Cell[][] = useSelector(
        (state: ApplicationState) => state.grid.grid
    );
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
