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

/**
 * Properties for the GridCell component.
 */
export interface Props {
    cell: Cell;
    setSelectedCell: (s: SelectedCell | null) => void;
    col: number;
    row: number;
}

/**
 * Helper function that subscribes a cell to an appropriate CellObserver
 * via mapping the given CartesianPair to the cell at that
 * location in the grid.
 */
const useSub = (coords: CartesianPair) => {
    const [shouldUpdate, setShouldUpdate] = useState(0);
    var { observer, observable }: SubscriptionBundle =
        CellObserverStore.getInstance().addMe(coords, setShouldUpdate);
    return { shouldUpdate, observable, observer };
};

/**
 * The GridCell React Functional Component, which represents each cell in
 * the spreadsheet grid. Stores state, talks to dependencies, and is
 * updated via Redux actions.
 */
export const GridCell: React.FC<Props> = ({
    cell,
    setSelectedCell,
    col,
    row,
}) => {
    // Sets the text content of this GridCell
    const [cellContent, setCellContent] = useState("");
    // Sets the color of this GridCell
    const [cellColor, setCellColor] = useState(cell.color);
    // Sets the state of this GridCell to error, if needed
    const [error, setError] = useState("");
    // access Redux dispatch method to apply changes to the store
    const dispatch = useDispatch();
    const ref = useRef<HTMLInputElement>(null);
    // select the state of this cell from the Redux store
    const state = useSelector((state: ApplicationState) => state.grid);
    const grid = state.grid;
    const repeatCharacterCount = Math.ceil((col + 1) / 26);
    const character: string = String.fromCharCode(97 + (col % 26));
    const cellName = `${character.repeat(repeatCharacterCount)}${row + 1}`;
    // the display for an error (changes background of cell to light red)
    const errorTheme = error ? { background: red[50] } : {};

    const { shouldUpdate, observable, observer } = useSub({ x: col, y: row });

    // reset dependencies in the store for the given observables (list
    // of cell locations)
    const updateDependencies = (deps: CartesianPair[]) => {
        CellObserverStore.getInstance().resetListenersInObservable(
            deps,
            observer
        );
    };

    // Parse the contents of a GridCell
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
    // Submit the content of the cell to the Redux store
    const submitContent = () => {
        if (cellContent !== cell.content) {
            dispatch(replaceContent(state, cellContent, row, col));
        } else {
            setError("");
            handleParse();
        }
    };

    // Handle "Enter" keyboard click by submitting content
    // and deselecting the currently selected GridCell
    const handleKeys = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            submitContent();
            if (ref.current) {
                ref.current.blur();
            }
        }
    };

    // Parse content for expressions anytime
    // the cell's content or dependencies change
    useEffect(() => {
        setError("");
        handleParse();
        // eslint-disable-next-line
    }, [cell.content, shouldUpdate]);

    // Set the color of the GridCell anytime the corresponding
    // business logic Cell object's color changes
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
