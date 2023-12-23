import DetailsIcon from "@mui/icons-material/Details";
import {Link} from "react-router-dom";
import React from "react";
import {ListItemIcon, Stack} from "@mui/material";

export default function DetailsLink({ linkTo }) {
  return (
    <Link
      to={linkTo} underline="hover"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Stack direction="row" alignItems="center" sx={{color: "primary.main"}}>
        <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
          <DetailsIcon />
        </ListItemIcon>
        View
      </Stack>
    </Link>
  );
}