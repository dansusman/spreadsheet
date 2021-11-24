import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./FXBar.css";

interface Props {}

const FXBar = (props: Props) => {
    return (
        <div className="fxBar">
            <div className="selectCell">
                <div className="cellName">A1</div>
                <ArrowDropDownIcon />
            </div>
            <div className="fx">fx</div>
            <input className="function" />
        </div>
    );
};

export default FXBar;
