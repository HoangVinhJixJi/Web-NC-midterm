import {TableCell, TableRow} from "@mui/material";
import React from "react";
import UserInfo from "../item widgets/UserInfo";
import DetailsLink from "../item widgets/DetailsLink";
import ActionButton from "../item widgets/ActionButton";

export default function PendingAccountItem({ user, onActiveClick }) {
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
        <ActionButton action="ACTIVE" handler={onActiveClick} />
      </TableCell>
      <TableCell>
        <DetailsLink linkTo={`/management/account/details/${user.username}`} />
      </TableCell>
    </TableRow>
  );
}