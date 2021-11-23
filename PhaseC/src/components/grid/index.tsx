import React from "react";
import { Cell } from "../../store/grid/types";
import GridCell from "./gridCell";
import "./Grid.css";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";

interface Props {}

const Grid: React.FC<Props> = () => {
    const grid: Cell[][] = useSelector(
        (state: ApplicationState) => state.grid.grid
    );
    return (
        <div className="grid">
            {grid.map((row, rowKey) => (
                <div className="row" key={rowKey}>
                    <div className="rowHeader">{rowKey + 1}</div>
                    {row.map((cell, cellKey) => (
                        <GridCell cell={cell} key={cellKey} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Grid;
