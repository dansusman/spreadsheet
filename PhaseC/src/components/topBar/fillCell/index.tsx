import React, { useState } from "react";
import { Button, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import FormatColorFillRoundedIcon from "@mui/icons-material/FormatColorFillRounded";
import "./fillCell.css";
import {
  lightBlue,
  lightGreen,
  orange,
  purple,
  red,
  yellow,
} from "@mui/material/colors";
import { SelectedCell } from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import { fillCell } from "../../../store/grid/actions";
import { ApplicationState } from "../../../store";

const COLORS = {
  red: red[400],
  orange: orange[400],
  yellow: yellow[400],
  green: lightGreen[400],
  blue: lightBlue[300],
  purple: purple[200],
};

interface OptionProps {
  color: string;
  setDropDownState: (b: boolean) => void;
  selectedCell: SelectedCell | null;
}

const FillCellOption: React.FC<OptionProps> = ({
  color,
  setDropDownState,
  selectedCell,
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state: ApplicationState) => state.grid);
  const fillCellStyle = {
    background: color,
  };

  const handleColorClick = () => {
    if (selectedCell) {
      dispatch(fillCell(state, color, selectedCell.row, selectedCell.column));
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

interface Props {
  buttonTheme: SxProps<Theme>;
  selectedCell: SelectedCell | null;
}

const FillCellButton: React.FC<Props> = ({ buttonTheme, selectedCell }) => {
  const [isDropdown, setIsDropDown] = useState(false);
  return (
    <div className="fillCell">
      <Button
        sx={{
          ...buttonTheme,
        }}
        variant="contained"
        onClick={() => setIsDropDown((cur) => !cur)}
      >
        <div className="label">
          <FormatColorFillRoundedIcon />
          {/* TODO: Update color of FormatColorFillRoundedIcon to match selected color? */}
          {/* <FormatColorFillRoundedIcon htmlColor={COLORS.purple} /> */}
          <span>Fill Cell</span>
        </div>
      </Button>
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
    </div>
  );
};

export default FillCellButton;
