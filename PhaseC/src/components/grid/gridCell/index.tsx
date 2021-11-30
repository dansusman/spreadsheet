import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../../store";
import { replaceContent } from "../../../store/grid/actions";
import { Cell } from "../../../store/grid/types";
import { SelectedCell } from "../../../types";
import { FunctionParser } from "../../../util/operationParser";
import "./GridCell.css";

interface Props {
    cell: Cell;
    setSelectedCell: (s: SelectedCell | null) => void;
    col: number;
    row: number;
}

const GridCell: React.FC<Props> = ({ cell, setSelectedCell, col, row }) => {
    const [cellContent, setCellContent] = useState("");
    const [cellColor, setCellColor] = useState(cell.color);
    const dispatch = useDispatch();
    const ref = useRef<HTMLInputElement>(null);
    const state = useSelector((state: ApplicationState) => state.grid);
    const grid = useSelector((state: ApplicationState) => state.grid.grid);
    const repeatCharacterCount = Math.ceil((col + 1) / 26);
    const character: string = String.fromCharCode(97 + (col % 26));
    const cellName = `${character.repeat(repeatCharacterCount)}${row + 1}`;

    const submitContent = () => {
        if (cellContent !== cell.content) {
            dispatch(replaceContent(state, cellContent, row, col));
        }
        setCellContent(
            new FunctionParser(grid, cell.content.trim()).evaluate()
        );
    };

    const handleKeys = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            submitContent();
            if (ref.current) {
                ref.current.blur();
            }
        }
    };

    useEffect(() => {
        if (cell.content) {
            setCellContent(
                new FunctionParser(grid, cell.content.trim()).evaluate()
            );
        } else {
            setCellContent("");
        }
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
                onFocus={() => setCellContent(cell.content)}
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
