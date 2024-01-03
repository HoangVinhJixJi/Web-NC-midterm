import {Stack, TableCell, TableRow} from '@mui/material';
import UserInfo from '../../../item widgets/UserInfo';
import ActionButton from '../../../item widgets/ActionButton';
import DetailsLink from '../../../item widgets/DetailsLink';
import React from 'react';
import {useLocation} from 'react-router-dom';

export default function ArchivedClassItem({ _class, onRestoreClick, onDeleteClick }) {
  const location = useLocation();

  return (
    <TableRow key={_class['classId']}>
      <TableCell>{_class['classId']}</TableCell>
      <TableCell>{_class['className']}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${_class['creator']['username']}`}
          state={{ from: location.pathname }}
          avatar={_class['creator']['avatar']}
          fullName={_class['creator']['fullName']}
        />
      </TableCell>
      <TableCell>
        <Stack>
          <ActionButton action="restore" handler={onRestoreClick} sx={{marginBottom: 1}} />
          <ActionButton action="delete" handler={onDeleteClick} />
        </Stack>
      </TableCell>
      <TableCell>
        <DetailsLink
          linkTo={`/management/class/details/${_class['classId']}`}
          state={{ from: location.pathname }}
        />
      </TableCell>
    </TableRow>
  );
}