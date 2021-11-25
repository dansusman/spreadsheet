import React, { useEffect, useState } from "react";
import { Cell } from "../../../store/grid/types";
import { SelectedCell } from "../../../types";
import "./GridCell.css";

interface Props {
    cell: Cell;
    setSelectedCell: (s: SelectedCell | null) => void;
    col: number;
    row: number;
}

const GridCell: React.FC<Props> = ({ cell, setSelectedCell, col, row }) => {
    const [cellContent, setCellContent] = useState(cell.content);
    const repeatCharacterCount = Math.ceil((col + 1) / 26);
    const character: string = String.fromCharCode(97 + (col % 26));
    const cellName = `${character.repeat(repeatCharacterCount)}${row}`;

    useEffect(() => {
        setCellContent(cell.content);
    }, [cell.content]);

    return (
        <div className="cell">
            <input
                value={cellContent}
                onChange={(e) => setCellContent(e.target.value)}
                onSelect={() =>
                    setSelectedCell({
                        column: col,
                        row: row,
                        cellLabel: cellName,
                    })
                }
                onBlur={() => setSelectedCell(null)}
            />
        </div>
    );
};

export default GridCell;
