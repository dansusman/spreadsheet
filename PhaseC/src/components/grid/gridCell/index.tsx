import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../../store";
import { replaceContent } from "../../../store/grid/actions";
import { Cell } from "../../../store/grid/types";
import { SelectedCell } from "../../../types";
import { FunctionParser } from "../../../util/operationParser";
import { StringParser } from "../../../util/stringParser";
import ErrorHelper from "./errorHelper";
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
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const ref = useRef<HTMLInputElement>(null);
    const state = useSelector((state: ApplicationState) => state.grid);
    const grid = useSelector((state: ApplicationState) => state.grid.grid);
    const repeatCharacterCount = Math.ceil((col + 1) / 26);
    const character: string = String.fromCharCode(97 + (col % 26));
    const cellName = `${character.repeat(repeatCharacterCount)}${row + 1}`;

    const handleParse = () => {
        setError("");
        if (cell.content.startsWith("=")) {
            const parsed = new FunctionParser(grid, cell.content.trim(), {
                y: row,
                x: col,
            }).evaluate();
            if (parsed.error) {
                setCellContent(parsed.error.errorType);
                setError(parsed.error.errorMessage);
            } else {
                setCellContent(parsed.content);
            }
        } else if (cell.content.includes('"')) {
            setCellContent(new StringParser(cell.content.trim()).evaluate());
        }
    };
    const submitContent = () => {
        if (cellContent !== cell.content) {
            dispatch(replaceContent(state, cellContent, row, col));
        }
        handleParse();
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
            handleParse();
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
            <ErrorHelper cellRef={ref} error={error} />
        </div>
    );
};

export default GridCell;
