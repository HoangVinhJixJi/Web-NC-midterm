import {ListItemIcon, Stack} from "@mui/material";
import React from "react";

export default function Status({ statusColor, statusIcon, statusText }) {
  return (
    <Stack direction="row" alignItems="center" sx={{color: statusColor}}>
      <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
        {statusIcon}
      </ListItemIcon>
      {statusText}
    </Stack>
  );
}