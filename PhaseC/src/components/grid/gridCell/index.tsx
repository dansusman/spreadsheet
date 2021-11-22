import React, { useEffect, useState } from "react";
import { Cell } from "../../../store/grid/types";
import "./GridCell.css";

interface Props {
    cell: Cell;
}

const GridCell: React.FC<Props> = ({ cell }) => {
    const [cellContent, setCellContent] = useState(cell.content);

    useEffect(() => {
        setCellContent(cell.content);
    }, [cell.content]);

    return (
        <div className="cell">
            <input
                value={cellContent}
                onChange={(e) => setCellContent(e.target.value)}
            />
        </div>
    );
};

export default GridCell;
