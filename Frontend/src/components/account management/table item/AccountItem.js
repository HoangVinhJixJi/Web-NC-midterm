import {Avatar, Button, ListItemAvatar, Stack, TableCell, TableRow} from "@mui/material";
import {Link} from "react-router-dom";
import React from "react";
import RenderFunctions from "../table functions/RenderFunctions";
import Status from "./column/Status";

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
        {user.status === 'Pending' && (
          <Button variant="contained" color="secondary" onClick={onActiveClick}>
            Active
          </Button>
        )}
        {user.status === 'Active' && (
          <Button variant="contained" color="primary" onClick={onBanClick}>
            Ban
          </Button>
        )}
        {user.status === 'Banned' && (
          <Button variant="contained" color="inherit" onClick={onUnbanClick}>
            Unban
          </Button>
        )}
      </TableCell>
      <TableCell>
        <Link to={`mangement/account/details/${user.username}`} underline="hover">
          {user.username}
        </Link>
      </TableCell>
    </TableRow>
  );
}