import {Avatar, ListItemAvatar, Stack} from "@mui/material";
import {Link} from "react-router-dom";
import React from "react";

export default function UserInfo({ linkTo, avatar, fullName }) {
  return (
    <Link
      to={linkTo}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <ListItemAvatar>
          <Avatar src={avatar} alt={fullName} />
        </ListItemAvatar>
        {fullName}
      </Stack>
    </Link>
  );
}