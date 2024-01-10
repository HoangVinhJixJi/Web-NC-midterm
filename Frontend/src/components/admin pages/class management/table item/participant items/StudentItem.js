import {useLocation} from 'react-router-dom';
import {TableCell, TableRow} from '@mui/material';
import UserInfo from '../../../item widgets/UserInfo';
import DetailsLink from '../../../item widgets/DetailsLink';
import React from 'react';
import ActionButton from '../../../item widgets/ActionButton';

export default function StudentItem({ student, onAssignStudentIdClick }) {
  const location = useLocation();

  return (
    <TableRow key={student['userId']}>
      <TableCell>{student['userId']}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${student['username']}`}
          state={{ from: location.pathname }}
          avatar={student['avatar']}
          fullName={student['fullName']}
        />
      </TableCell>
      <TableCell>
        {student['timeOfParticipation']}
      </TableCell>
      <TableCell>
        {student['studentId'] ?? 'NO DATA'}
      </TableCell>
      <TableCell>
        <ActionButton action="assign_id" handler={onAssignStudentIdClick} />
      </TableCell>
      <TableCell>
        <DetailsLink
          linkTo={`/management/account/details/${student['username']}`}
          state={{ from: location.pathname }}
        />
      </TableCell>
    </TableRow>
  );
}