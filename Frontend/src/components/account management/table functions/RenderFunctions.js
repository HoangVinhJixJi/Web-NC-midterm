import {ListItemIcon, Stack, TableCell} from "@mui/material";
import React from "react";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

function renderTableColumnTitle(titleNames) {
  return titleNames.map((titleName) => (
    <TableCell><strong>{titleName}</strong></TableCell>
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
export default function RenderFunctions() {
  return { renderTableColumnTitle, renderStatus };
}