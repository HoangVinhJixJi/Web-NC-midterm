import {ListItemIcon, Stack, TableCell} from "@mui/material";
import React from "react";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

function renderTableColumnTitle(titleNames, handleSort) {
  return titleNames.map((columnName) => (
    <TableCell key={columnName} onClick={() => handleSort(columnName)}>
      <strong>{columnName}</strong>
    </TableCell>
  ));
}
function renderStatus(status) {
  switch (status) {
    case 'Pending':
      return (
        <Stack direction="row" alignItems="center" sx={{color: "#ffc107"}}>
          <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
            <PendingOutlinedIcon />
          </ListItemIcon>
          {status}
        </Stack>);
    case 'Activated':
      return (
        <Stack direction="row" alignItems="center" sx={{color: "success.main"}}>
          <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
            <CheckCircleOutlinedIcon />
          </ListItemIcon>
          {status}
        </Stack>);
    case 'Banned':
      return (
        <Stack direction="row" alignItems="center" sx={{color: "error.main"}}>
          <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
            <BlockOutlinedIcon />
          </ListItemIcon>
          {status}
        </Stack>);
    default:
      return null;
  }
}
function sortTable(a, b, sortedBy, sortOrder) {
  console.log(sortOrder);
  if (sortedBy === 'User Info') {
    const lastNameA = a.fullName.split(' ').pop().toLowerCase();
    const lastNameB = b.fullName.split(' ').pop().toLowerCase();
    return sortOrder === 'asc' ? lastNameA.localeCompare(lastNameB) : lastNameB.localeCompare(lastNameA);
  }
  // Các trường hợp sắp xếp khác
}
export default function RenderFunctions() {
  return { renderTableColumnTitle, renderStatus, sortTable };
}