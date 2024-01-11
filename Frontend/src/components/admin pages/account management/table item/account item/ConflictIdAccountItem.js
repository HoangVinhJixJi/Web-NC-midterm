import {useLocation} from 'react-router-dom';
import {TableCell, TableRow} from '@mui/material';
import UserInfo from '../../../item widgets/UserInfo';
import ActionButton from '../../../item widgets/ActionButton';
import DetailsLink from '../../../item widgets/DetailsLink';
import React from 'react';

export default function ConflictIdAccountItem({ account, disabledActiveIdButton, onActiveIdClick, sendId }) {
  const location = useLocation();

  return (
    <TableRow key={account.userId}>
      <TableCell>{account.userId}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${account.username}`}
          state={{ from: location.pathname }}
          avatar={account.avatar}
          fullName={account.fullName}
        />
        <strong>{sendId === account.userId && '(Sender report)'}</strong>
      </TableCell>
      <TableCell>
        {account.studentId ?? '<NO DATA>'}
      </TableCell>
      <TableCell>
        <ActionButton action="active id" disabled={disabledActiveIdButton} handler={onActiveIdClick} />
      </TableCell>
      <TableCell>
        <DetailsLink
          linkTo={`/management/account/details/${account.username}`}
          state={{ from: location.pathname }}
        />
      </TableCell>
    </TableRow>
  );
}