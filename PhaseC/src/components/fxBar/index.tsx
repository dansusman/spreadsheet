import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./FXBar.css";
import { SelectedCell } from "../../types";

interface Props {
    selectedCell: SelectedCell | null;
}

const FXBar: React.FC<Props> = ({ selectedCell }) => {
    return (
        <div className="fxBar">
            <div className="selectCell">
                <div className="cellName">
                    {selectedCell ? selectedCell.cellLabel.toUpperCase() : ""}
                </div>
                <ArrowDropDownIcon />
            </div>
            <div className="fx">fx</div>
            <input className="function" />
        </div>
    );
};

export default FXBar;
