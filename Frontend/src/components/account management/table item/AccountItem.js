import {Avatar, Button, ListItemAvatar, ListItemIcon, Select, Stack, TableCell, TableRow} from "@mui/material";
import {Link} from "react-router-dom";
import React from "react";
import RenderFunctions from "../table functions/RenderFunctions";
import SettingsIcon from '@mui/icons-material/Settings';

const Actions = {
  pending: ["ACTIVE"],
  active: ["BAN"],
  banned: ["UNBAN", "DELETE"]
}
export default function AccountItem({ user, onActiveClick, onBanClick, onUnbanClick }) {
  const { renderStatus } = RenderFunctions();

  return (
    <TableRow key={user.userId}>
      <TableCell>{user.userId}</TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ListItemAvatar>
            <Avatar src={user.avatar} alt={user.fullName} />
          </ListItemAvatar>
          {user.fullName}
        </Stack>
      </TableCell>
      <TableCell>
        {renderStatus(user.status)}
      </TableCell>
      <TableCell>
        <Button direction="row" alignItems="center" sx={{minWidth: 0, color: "gray"}}>
          <SettingsIcon />
        </Button>
      </TableCell>
      <TableCell>
        <Link to={`mangement/account/details/${user.username}`} underline="hover">
          {user.username}
        </Link>
      </TableCell>
    </TableRow>
  );
}