import {TableCell, TableRow} from "@mui/material";
import React from "react";
import DetailsLink from "../item widgets/DetailsLink";
import UserInfo from "../item widgets/UserInfo";
import ActionButton from "../item widgets/ActionButton";

export default function BannedAccountItem({ user, onUnbanClick, onDeleteClick }) {
  return (
    <TableRow key={user.userId}>
      <TableCell>{user.userId}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${user.username}`}
          avatar={user.avatar}
          fullName={user.fullName}
        />
      </TableCell>
      <TableCell>
        {user.startTime}
      </TableCell>
      <TableCell>
        {user.endTime}
      </TableCell>
      <TableCell>
        <ActionButton action="UNBAN" handler={onUnbanClick} sx={{marginBottom: 1}} />
        <ActionButton action="DELETE" handler={onDeleteClick} />
      </TableCell>
      <TableCell>
        <DetailsLink linkTo={`/management/account/details/${user.username}`} />
      </TableCell>
    </TableRow>
  );
}