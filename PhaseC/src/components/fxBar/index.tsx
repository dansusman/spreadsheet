import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { SelectedCell } from "../../types";
import "./FXBar.css";

/**
 * Properties of FXBar components.
 */
interface Props {
    selectedCell: SelectedCell | null;
}

/**
 * The FXBar React Functional Component. This object is shown
 * above the grid of cells, and shows the content of the selected GridCell.
 */
const FXBar: React.FC<Props> = ({ selectedCell }) => {
    const [fxValue, setFXValue] = useState("");
    const grid = useSelector((state: ApplicationState) => state.grid.grid);

    useEffect(() => {
        if (selectedCell) {
            const cellContents: string =
                grid[selectedCell!.row][selectedCell!.column].content;
            setFXValue(cellContents);
        } else {
            setFXValue("");
        }
    }, [selectedCell, grid]);
    return (
        <div className="fxBar">
            <div className="selectCell">
                <div className="cellName">
                    {selectedCell ? selectedCell.cellLabel.toUpperCase() : ""}
                </div>
            </div>
            <div className="fx">fx</div>
            <input
                className="function"
                value={fxValue}
                readOnly
                disabled={true}
            />
        </div>
    );
};

export default FXBar;
