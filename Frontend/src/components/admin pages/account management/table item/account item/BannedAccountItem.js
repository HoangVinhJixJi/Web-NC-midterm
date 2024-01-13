import {Stack, TableCell, TableRow} from '@mui/material';
import React from "react";
import DetailsLink from "../../../item widgets/DetailsLink";
import UserInfo from "../../../item widgets/UserInfo";
import ActionButton from "../../../item widgets/ActionButton";
import RenderFunctions from '../../../table functions/RenderFunctions';
import {useLocation} from 'react-router-dom';

export default function BannedAccountItem({ user, onUnbanClick, onDeleteClick }) {
  const { formatDateTime } = RenderFunctions();
  const location = useLocation();

  function renderTotalDaysBannedUnit(day) {
    return day === 1 ? 'day' : day !== 365 ? 'days' : 'year';
  }

  return (
    <TableRow key={user['userInfo']['_id']}>
      <TableCell>{user['userInfo']['_id']}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${user['userInfo'].username}`}
          state={{ from: location.pathname }}
          avatar={user['userInfo'].avatar}
          fullName={user['userInfo'].fullName}
        />
        {user['userInfo']['studentId'] ? `(sID: ${user['userInfo']['studentId']})` : '(No Student ID)'}
      </TableCell>
      <TableCell>
        {user['bannedInfo']['numOfDaysBanned'] !== 365 ? user['bannedInfo']['numOfDaysBanned'] : 1} {renderTotalDaysBannedUnit(user['bannedInfo']['numOfDaysBanned'])}
      </TableCell>
      <TableCell>
        {formatDateTime(user['bannedInfo']['bannedStartTime'])}
      </TableCell>
      <TableCell>
        {formatDateTime(user['bannedInfo']['bannedEndTime'])}
      </TableCell>
      <TableCell>
        <Stack>
          <ActionButton action="UNBAN" handler={onUnbanClick} sx={{marginBottom: 1}} />
          <ActionButton action="DELETE" handler={onDeleteClick} />
        </Stack>
      </TableCell>
      <TableCell>
        <DetailsLink
          linkTo={`/management/account/details/${user['userInfo'].username}`}
          state={{ from: location.pathname }}
        />
      </TableCell>
    </TableRow>
  );
}