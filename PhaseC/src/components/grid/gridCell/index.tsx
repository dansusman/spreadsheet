import React from "react";
import { Cell } from "../../../store/grid/types";
import "./GridCell.css";

interface Props {
    cell: Cell;
}

const GridCell: React.FC<Props> = ({ cell }) => {
    return <div className="cell"></div>;
};

export default GridCell;
