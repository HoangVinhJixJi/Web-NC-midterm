import {TableCell, TableRow} from "@mui/material";
import React from "react";
import DetailsLink from "../item widgets/DetailsLink";
import UserInfo from "../item widgets/UserInfo";
import ActionButton from "../item widgets/ActionButton";
import RenderFunctions from '../../table functions/RenderFunctions';

export default function BannedAccountItem({ user, onUnbanClick, onDeleteClick }) {
  const { formatDateTime } = RenderFunctions();

  function renderTotalDaysBannedUnit(day) {
    return day === 1 ? 'day' : 'days';
  }

  return (
    <TableRow key={user['userInfo']['_id']}>
      <TableCell>{user['userInfo']['_id']}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${user['userInfo'].username}`}
          avatar={user['userInfo'].avatar}
          fullName={user['userInfo'].fullName}
        />
      </TableCell>
      <TableCell>
        {user['bannedInfo']['numOfDaysBanned']} {renderTotalDaysBannedUnit(user['bannedInfo']['numOfDaysBanned'])}
      </TableCell>
      <TableCell>
        {formatDateTime(user['bannedInfo']['bannedStartTime'])}
      </TableCell>
      <TableCell>
        {formatDateTime(user['bannedInfo']['bannedEndTime'])}
      </TableCell>
      <TableCell>
        <ActionButton action="UNBAN" handler={onUnbanClick} sx={{marginBottom: 1}} />
        <ActionButton action="DELETE" handler={onDeleteClick} />
      </TableCell>
      <TableCell>
        <DetailsLink linkTo={`/management/account/details/${user['userInfo'].username}`} />
      </TableCell>
    </TableRow>
  );
}