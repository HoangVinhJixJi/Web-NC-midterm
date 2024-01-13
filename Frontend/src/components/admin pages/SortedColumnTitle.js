import {ListItemIcon, Stack} from '@mui/material';
import React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ImportExportIcon from '@mui/icons-material/ImportExport';

export default function SortedColumnTitle({ titleText, sortOrder, onSortClick }) {
  return (
    <Stack direction="row" alignItems="center" onClick={onSortClick} sx={{ cursor: "pointer" }}>
      <strong>{titleText}</strong>
      <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
        {sortOrder === '' ? <ImportExportIcon /> : sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </ListItemIcon>
    </Stack>
  );
}