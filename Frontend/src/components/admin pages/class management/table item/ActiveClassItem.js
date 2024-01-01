import RenderFunctions from '../../table functions/RenderFunctions';
import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import ActionButton from '../../item widgets/ActionButton';
import {Button, Menu, TableCell, TableRow} from '@mui/material';
import UserInfo from '../../item widgets/UserInfo';
import SettingsIcon from '@mui/icons-material/Settings';
import DetailsLink from '../../item widgets/DetailsLink';

export default function ActiveClassItem({ _class, onArchiveClick }) {
  return (
    <TableRow key={_class['classId']}>
      <TableCell>{_class['classId']}</TableCell>
      <TableCell>{_class['className']}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${_class['creator']['username']}`}
          avatar={_class['creator']['avatar']}
          fullName={_class['creator']['fullName']}
        />
      </TableCell>
      <TableCell>
        <ActionButton action="archive" handler={onArchiveClick} />
      </TableCell>
      <TableCell>
        <DetailsLink linkTo={`/management/class/details/${_class['classId']}`} />
      </TableCell>
    </TableRow>
  );
}