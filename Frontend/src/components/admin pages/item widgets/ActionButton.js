import {Button, ListItemIcon, Stack} from "@mui/material";
import React from "react";
import RenderFunctions from "../table functions/RenderFunctions";

export default function ActionButton({ action, handler, sx }) {
  const { renderActionButtonColor, renderActionButtonIcon } = RenderFunctions();
  return (
    <Button
      variant="contained"
      color={renderActionButtonColor(action)}
      onClick={handler}
      sx={{ ...sx, fontSize: 12, maxHeight: 23 }}
    >
      <Stack direction="row" alignItems="center">
        <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
          {renderActionButtonIcon(action)}
        </ListItemIcon>
        {action.toUpperCase()}
      </Stack>
    </Button>
  );
}