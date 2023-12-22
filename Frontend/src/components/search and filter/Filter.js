import {Button, MenuItem, Select} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React from "react";

export default function Filter(
  {
    name,
    options,
    isDisplayClearButton,
    onClearClick,
    selectedOption,
    onFilterSelect
  }) {
  function renderOptions() {
    return options.map((option) => (
      <MenuItem value={option}>{option}</MenuItem>
    ));
  }
  return (
    <div>
      {isDisplayClearButton &&
        <Button sx={{ minWidth: 0, color: "gray" }} onClick={onClearClick}>
          <HighlightOffIcon />
        </Button>}
      <Select
        value={selectedOption}
        onChange={onFilterSelect}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="" disabled>{name ? name : ""}</MenuItem>
        {renderOptions()}
      </Select>
    </div>
  );
}