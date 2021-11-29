import React, { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./FXBar.css";
import { SelectedCell } from "../../types";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";

interface Props {
    selectedCell: SelectedCell | null;
}

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
    }, [selectedCell]);
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
