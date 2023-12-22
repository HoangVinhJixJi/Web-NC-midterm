import {Avatar, Button, ListItemAvatar, Stack, TableCell, TableRow} from "@mui/material";
import {Link} from "react-router-dom";
import React from "react";

export default function BannedAccountItem({ user, onUnbanClick, onDeleteClick }) {
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
        {user.startTime}
      </TableCell>
      <TableCell>
        {user.endTime}
      </TableCell>
      <TableCell>
        <Button variant="contained" color="inherit" sx={{marginBottom: 1}} onClick={onUnbanClick}>
          Unban
        </Button>
        <Button variant="contained" color="error" onClick={onDeleteClick}>
          Delete
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