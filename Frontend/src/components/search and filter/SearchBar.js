import {Button, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

export default function SearchBar({ placeholder, searchTerm, onSearchTermChange, onSearchClick }) {
  return (
    <TextField
      sx={{ marginRight: 4 }}
      variant="outlined" value={searchTerm} placeholder={placeholder ? placeholder : ""}
      onChange={onSearchTermChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>),
        endAdornment: (
          <InputAdornment position="end">
            <Button variant="contained" color="primary" onClick={onSearchClick}>
              Search
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
}