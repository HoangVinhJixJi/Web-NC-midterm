import {Button, Menu, TableCell, TableRow} from '@mui/material';
import UserInfo from '../../../item widgets/UserInfo';
import SettingsIcon from '@mui/icons-material/Settings';
import DetailsLink from '../../../item widgets/DetailsLink';
import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import ActionButton from '../../../item widgets/ActionButton';
import RenderFunctions from '../../../table functions/RenderFunctions';
import {useLocation} from 'react-router-dom';

const Actions = {
  archived: ["RESTORE", "DELETE"],
  active: ["ARCHIVE"],
}
export default function ClassItem({ _class, onArchiveClick, onRestoreClick, onDeleteClick }) {
  const { renderStatus } = RenderFunctions();
  const [anchorElActions, setAnchorElActions] = useState(null);
  const location = useLocation();

  function renderActionButtonHandler(action) {
    switch (action.toLowerCase()) {
      case "archive":
        return onArchiveClick;
      case "restore":
        return onRestoreClick;
      case "delete":
        return onDeleteClick;
      default:
        return null;
    }
  }
  function renderActionMenu(actions) {
    return actions.map(action => (
      <MenuItem key={action} onClick={handleCloseActionMenu}>
        <ActionButton action={action} handler={renderActionButtonHandler(action)} />
      </MenuItem>
    ));
  }
  function handleCloseActionMenu() {
    setAnchorElActions(null);
  }
  function handleOpenActionMenu(event) {
    setAnchorElActions(event.currentTarget);
  }

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
        {renderStatus(_class['status'])}
      </TableCell>
      <TableCell>
        <Button
          direction="row" alignItems="center" sx={{minWidth: 0, color: "gray"}}
          onClick={handleOpenActionMenu}
        >
          <SettingsIcon />
        </Button>
        <Menu
          anchorEl={anchorElActions}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElActions)}
          onClose={handleCloseActionMenu}
        >
          {_class['status'] === "active" && renderActionMenu(Actions.active)}
          {_class['status'] === "archived" && renderActionMenu(Actions.archived)}
        </Menu>
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