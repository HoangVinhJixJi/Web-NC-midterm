import {Avatar, Button, ListItemAvatar, Stack, TableCell, TableRow} from "@mui/material";
import {Link} from "react-router-dom";
import React from "react";

export default function PendingAccountItem({ user, onActiveClick }) {
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
        <Button variant="contained" color="primary" onClick={onActiveClick}>
          Active
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