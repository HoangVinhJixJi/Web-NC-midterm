import {useLocation} from 'react-router-dom';
import {TableCell, TableRow} from '@mui/material';
import UserInfo from '../../../item widgets/UserInfo';
import DetailsLink from '../../../item widgets/DetailsLink';
import React from 'react';

export default function TeacherItem({ teacher }) {
  const location = useLocation();

  return (
    <TableRow key={teacher['userId']}>
      <TableCell>{teacher['userId']}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${teacher['username']}`}
          state={{ from: location.pathname }}
          avatar={teacher['avatar']}
          fullName={teacher['fullName']}
        />
        <strong>{teacher['isCreator'] ? '(creator)' : ''}</strong>
      </TableCell>
      <TableCell>
        {teacher['timeOfParticipation']}
      </TableCell>
      <TableCell>
        <DetailsLink
          linkTo={`/management/account/details/${teacher['username']}`}
          state={{ from: location.pathname }}
        />
      </TableCell>
    </TableRow>
  );
}