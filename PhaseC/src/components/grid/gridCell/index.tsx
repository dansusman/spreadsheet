import { CollectionsBookmarkTwoTone } from "@mui/icons-material";
import { handleBreakpoints } from "@mui/system";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../../store";
import { replaceContent } from "../../../store/grid/actions";
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
    const [cellColor, setCellColor] = useState(cell.color);
    const dispatch = useDispatch();
    const ref = useRef<HTMLInputElement>(null);
    const state = useSelector((state: ApplicationState) => state.grid);
    const repeatCharacterCount = Math.ceil((col + 1) / 26);
    const character: string = String.fromCharCode(97 + (col % 26));
    const cellName = `${character.repeat(repeatCharacterCount)}${row + 1}`;

    const submitContent = () => {
        if (cellContent !== cell.content) {
            dispatch(replaceContent(state, cellContent, row, col));
        }
    };

    const handleKeys = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            console.log("We are here");
            submitContent();
            if (ref.current) {
                ref.current.blur();
            }
        }
    };

    useEffect(() => {
        setCellContent(cell.content);
    }, [cell.content]);

    useEffect(() => {
        setCellColor(cell.color);
    }, [cell.color]);

    return (
        <div className="cell">
            <input
                style={{ background: cellColor }}
                ref={ref}
                value={cellContent}
                onChange={(e) => setCellContent(e.target.value)}
                onSelect={() =>
                    setSelectedCell({
                        column: col,
                        row: row,
                        cellLabel: cellName,
                    })
                }
                onKeyPress={handleKeys}
                onBlur={submitContent}
            />
        </div>
    );
};

export default GridCell;
