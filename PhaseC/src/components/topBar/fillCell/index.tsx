import FormatColorFillRoundedIcon from "@mui/icons-material/FormatColorFillRounded";
import { Button, Theme } from "@mui/material";
import {
    lightBlue,
    lightGreen,
    orange,
    purple,
    red,
    yellow,
} from "@mui/material/colors";
import { SxProps } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../../store";
import { fillCell } from "../../../store/grid/actions";
import { SelectedCell } from "../../../types";
import "./fillCell.css";

/**
 * Colors from MUI used in the FillCell Dropdown.
 */
const COLORS = {
    red: red[400],
    orange: orange[400],
    yellow: yellow[400],
    green: lightGreen[400],
    blue: lightBlue[300],
    purple: purple[200],
};

/**
 * Properties for FillCellOption React component.
 */
interface OptionProps {
    color: string;
    setDropDownState: (b: boolean) => void;
    selectedCell: SelectedCell | null;
}

/**
 * The FillCellOption React Functional Component, which is displayed
 * when the FillCell button is pressed in the top bar. Holds 6 color options
 * Red, Orange, Yellow, Green, Blue, and Purple, each of which updates
 * the selected cell's color.
 */
const FillCellOption: React.FC<OptionProps> = ({
    color,
    setDropDownState,
    selectedCell,
}) => {
    const dispatch = useDispatch();
    // grab the state of the grid from Redux store
    const state = useSelector((state: ApplicationState) => state.grid);
    const fillCellStyle = {
        background: color,
    };

    // when color is clicked, dispatch the call to Redux that will
    // apply the new cell color to the stored Cell object's color field
    const handleColorClick = () => {
        if (selectedCell) {
            dispatch(
                fillCell(state, color, selectedCell.row, selectedCell.column)
            );
        }
        setDropDownState(false);
    };
    return (
        <div
            className="option"
            style={fillCellStyle}
            onClick={handleColorClick}
        ></div>
    );
};

/**
 * Properties for the FillCellButton React component.
 */
interface Props {
    buttonTheme: SxProps<Theme>;
    selectedCell: SelectedCell | null;
}

/**
 * The FillCellButton React Functional Component, which is last in the
 * top bar of buttons.
 */
const FillCellButton: React.FC<Props> = ({ buttonTheme, selectedCell }) => {
    const [isDropdown, setIsDropDown] = useState(false);
    return (
        <>
            <Button
                sx={{
                    ...buttonTheme,
                }}
                className="fillCell"
                variant="contained"
                onClick={() => setIsDropDown((cur) => !cur)}
            >
                <div className="label">
                    <FormatColorFillRoundedIcon />
                    <span>Fill Cell</span>
                </div>
                {isDropdown && (
                    <div className="dropDown">
                        {Object.values(COLORS).map((color) => (
                            <FillCellOption
                                key={color}
                                color={color}
                                selectedCell={selectedCell}
                                setDropDownState={setIsDropDown}
                            />
                        ))}
                    </div>
                )}
            </Button>
        </>
    );
};

export default FillCellButton;
