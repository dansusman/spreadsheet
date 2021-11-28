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

const COLORS = {
  red: red[500],
  orange: orange[500],
  yellow: yellow[500],
  green: lightGreen[500],
  blue: lightBlue[500],
  purple: purple[300],
};

interface OptionProps {
  color: string;
  setDropDownState: (b: boolean) => void;
}

const FillCellOption: React.FC<OptionProps> = ({ color, setDropDownState }) => {
  const fillCellStyle = {
    background: color,
  };

  const handleColorClick = () => {
    console.log(color);
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
}

const FillCellButton: React.FC<Props> = ({ buttonTheme }) => {
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
            <FillCellOption color={color} setDropDownState={setIsDropDown} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FillCellButton;
