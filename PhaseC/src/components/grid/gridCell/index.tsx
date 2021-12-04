import { red } from "@mui/material/colors";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../../store";
import { replaceContent } from "../../../store/grid/actions";
import { Cell } from "../../../store/grid/types";
import {
    CartesianPair,
    SelectedCell,
    SubscriptionBundle,
} from "../../../types";
import { CellObserverStore } from "../../../util/observer";
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

const useSub = (coords: CartesianPair) => {
    const [shouldUpdate, setShouldUpdate] = useState(0);
    var { observer, observable }: SubscriptionBundle =
        CellObserverStore.getInstance().addMe(coords, setShouldUpdate);
    return { shouldUpdate, observable, observer };
};

const GridCell: React.FC<Props> = ({ cell, setSelectedCell, col, row }) => {
    const [cellContent, setCellContent] = useState("");
    const [cellColor, setCellColor] = useState(cell.color);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const ref = useRef<HTMLInputElement>(null);
    const state = useSelector((state: ApplicationState) => state.grid);
    const grid = state.grid;
    const repeatCharacterCount = Math.ceil((col + 1) / 26);
    const character: string = String.fromCharCode(97 + (col % 26));
    const cellName = `${character.repeat(repeatCharacterCount)}${row + 1}`;
    const errorTheme = error ? { background: red[50] } : {};

    const { shouldUpdate, observable, observer } = useSub({ x: col, y: row });

    const updateDependencies = (deps: CartesianPair[]) => {
        CellObserverStore.getInstance().resetListenersInObservable(
            deps,
            observer
        );
    };

    const handleParse = () => {
        if (cell.content.startsWith("=")) {
            const parsed = new FunctionParser(grid, cell.content.trim(), {
                y: row,
                x: col,
            }).evaluate();
            updateDependencies(parsed.dependencies);
            if (parsed.error) {
                setCellContent(parsed.error.errorType);
                setError(parsed.error.errorMessage);
            } else {
                setCellContent(parsed.content);
            }
        } else if (cell.content.includes('"')) {
            setCellContent(new StringParser(cell.content.trim()).evaluate());
        } else {
            setCellContent(cell.content);
        }
        observable.notify();
    };
    const submitContent = () => {
        if (cellContent !== cell.content) {
            dispatch(replaceContent(state, cellContent, row, col));
        } else {
            setError("");
            handleParse();
        }
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
        setError("");
        handleParse();
    }, [cell.content, shouldUpdate]);

    useEffect(() => {
        setCellColor(cell.color);
    }, [cell.color]);

    return (
        <div className="cell">
            <input
                style={{ background: cellColor, ...errorTheme }}
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
