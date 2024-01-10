import {Button, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import React from "react";

export default function SearchBar({ placeholder, searchTerm, onSearchTermChange, isButtonSearchEnabled, onSearchClick }) {
  return (
    <TextField
      sx={{ marginRight: 2.5, width: "22em" }}
      variant="outlined" value={searchTerm} placeholder={placeholder ? placeholder : ""}
      onChange={onSearchTermChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {searchTerm !== '' &&
              <Button sx={{ minWidth: 0, color: "gray" }}><ClearIcon /></Button>
            }
            <Button
              variant="contained" color="primary" sx={{ minWidth: 0 }}
              disabled={!isButtonSearchEnabled} onClick={onSearchClick}
            >
              <SearchIcon />
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
}