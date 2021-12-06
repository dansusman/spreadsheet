import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import { Theme } from "@mui/material";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import { SxProps } from "@mui/system";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import {
    addColumn,
    addRow,
    deleteColumn,
    deleteRow,
    redo,
    replaceContent,
    undo,
} from "../../store/grid/actions";
import { SelectedCell } from "../../types";
import FillCellButton from "./fillCell";
import "./TopBar.css";

// Theme for each button (css)
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

/**
 * Properties for the TopBar React component.
 */
interface Props {
    selectedCell: SelectedCell | null;
}

/**
 * The TopBar React FunctionalComponent, which is shown at the very
 * top of the spreadsheet application and holds all the buttons.
 */
const TopBar: React.FC<Props> = ({ selectedCell }) => {
    const dispatch = useDispatch();
    const spreadSheet = useSelector((state: ApplicationState) => state.grid);
    return (
        <div className="topBar">
            {/* ------- Undo Button ------- */}
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
            {/* ------- Redo Button ------- */}
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
            {/* ------- Clear Cell Button ------- */}
            <Button
                sx={{
                    ...buttonTheme,
                }}
                variant="contained"
                disabled={selectedCell === null}
                onClick={() => {
                    if (selectedCell) {
                        dispatch(
                            replaceContent(
                                spreadSheet,
                                "",
                                selectedCell.row,
                                selectedCell.column
                            )
                        );
                    }
                }}
            >
                Clear Cell
            </Button>
            {/* Add Row Button */}
            <Button
                sx={{ ...buttonTheme }}
                variant="contained"
                onClick={() =>
                    dispatch(addRow(spreadSheet, selectedCell?.row || 0))
                }
            >
                Add Row
            </Button>
            {/*  ------- Delete Row Button ------- */}
            <Button
                sx={{
                    ...buttonTheme,
                }}
                variant="contained"
                onClick={() =>
                    dispatch(deleteRow(spreadSheet, selectedCell?.row || 0))
                }
            >
                Delete Row
            </Button>
            {/* ------- Add Column Button ------- */}
            <Button
                sx={{
                    ...buttonTheme,
                }}
                variant="contained"
                onClick={() =>
                    dispatch(addColumn(spreadSheet, selectedCell?.column || 0))
                }
            >
                Add Column
            </Button>
            {/* ------- Delete Column Button ------- */}
            <Button
                sx={{
                    ...buttonTheme,
                }}
                variant="contained"
                onClick={() =>
                    dispatch(
                        deleteColumn(spreadSheet, selectedCell?.column || 0)
                    )
                }
            >
                Delete Column
            </Button>
            {/* ------- Fill Cell Button ------- */}
            <FillCellButton
                buttonTheme={buttonTheme}
                selectedCell={selectedCell}
            />
        </div>
    );
};

export default TopBar;
