import {TableCell, TableRow} from "@mui/material";
import React from "react";
import UserInfo from "../../../item widgets/UserInfo";
import DetailsLink from "../../../item widgets/DetailsLink";
import ActionButton from "../../../item widgets/ActionButton";
import {useLocation} from 'react-router-dom';

export default function PendingAccountItem({ user, onActiveClick }) {
  const location = useLocation();

  return (
    <TableRow key={user['userId']}>
      <TableCell>{user['userId']}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${user.username}`}
          state={{ from: location.pathname }}
          avatar={user.avatar}
          fullName={user.fullName}
        />
      </TableCell>
      <TableCell>
        <ActionButton action="ACTIVE" handler={onActiveClick} />
      </TableCell>
      <TableCell>
        <DetailsLink
          linkTo={`/management/account/details/${user.username}`}
          state={{ from: location.pathname }}
        />
      </TableCell>
    </TableRow>
  );
}