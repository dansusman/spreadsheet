import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import Button from "@mui/material/Button";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import {
    addColumn,
    addRow,
    deleteColumn,
    deleteRow,
    redo,
    undo,
} from "../../store/grid/actions";
import "./TopBar.css";
import { purple } from "@mui/material/colors";
import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import FillCellButton from "./fillCell";
import { SelectedCell } from "../../types";

const buttonTheme: SxProps<Theme> = {
    mx: "10px",
    background: purple[100],
    color: "#000",
    fontWeight: "bold",
    fontSize: "clamp(9px, 14px, 1vw)",
    fontFamily: '"Poppins", sans-serif',
    textTransform: "none",
    ":hover": {
        background: purple[300],
    },
};

interface Props {
    selectedCell: SelectedCell | null;
}

const TopBar: React.FC<Props> = ({ selectedCell }) => {
    const dispatch = useDispatch();
    const spreadSheet = useSelector((state: ApplicationState) => state.grid);
    return (
        <div className="topBar">
            <Button
                sx={{ ...buttonTheme }}
                variant="contained"
                onClick={() => dispatch(undo(spreadSheet))}
            >
                <div className="label">
                    <UndoRoundedIcon />
                    <span>Undo</span>
                </div>
            </Button>
            <Button
                sx={{ ...buttonTheme }}
                variant="contained"
                onClick={() => dispatch(redo(spreadSheet))}
            >
                <div className="label">
                    <RedoRoundedIcon />
                    <span>Redo</span>
                </div>
            </Button>
            <Button
                sx={{ ...buttonTheme }}
                variant="contained"
                onClick={() => dispatch(addRow(spreadSheet, 0))}
            >
                Add Row
            </Button>
            <Button
                sx={{
                    ...buttonTheme,
                }}
                variant="contained"
                onClick={() => dispatch(deleteRow(spreadSheet, 0))}
            >
                Delete Row
            </Button>
            <Button
                sx={{
                    ...buttonTheme,
                }}
                variant="contained"
                onClick={() => dispatch(addColumn(spreadSheet, 0))}
            >
                Add Column
            </Button>
            <Button
                sx={{
                    ...buttonTheme,
                }}
                variant="contained"
                onClick={() => dispatch(deleteColumn(spreadSheet, 0))}
            >
                Delete Column
            </Button>
            <FillCellButton
                buttonTheme={buttonTheme}
                selectedCell={selectedCell}
            />
        </div>
    );
};

export default TopBar;
