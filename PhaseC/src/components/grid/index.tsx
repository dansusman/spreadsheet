import React from "react";
import { Cell } from "../../store/grid/types";
import GridCell from "./gridCell";
import "./Grid.css";

interface Props {
    grid: Cell[][];
}

const Grid: React.FC<Props> = ({ grid }) => {
    return (
        <div className="grid">
            {grid.map((row, rowKey) => (
                <div className="row" key={rowKey}>
                    {row.map((cell, cellKey) => (
                        <GridCell cell={cell} key={cellKey} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Grid;
