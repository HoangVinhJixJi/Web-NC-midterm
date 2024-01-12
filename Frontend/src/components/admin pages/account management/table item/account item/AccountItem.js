import {Button, Menu, TableCell, TableRow} from "@mui/material";
import React, {useState} from "react";
import RenderFunctions from "../../../table functions/RenderFunctions";
import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from "@mui/material/MenuItem";
import DetailsLink from "../../../item widgets/DetailsLink";
import UserInfo from "../../../item widgets/UserInfo";
import ActionButton from "../../../item widgets/ActionButton";
import {useLocation} from 'react-router-dom';

const Actions = {
  pending: ["ACTIVE"],
  active: ["BAN", "ASSIGN_ID"],
  banned: ["UNBAN", "DELETE", "ASSIGN_ID"]
}
const NO_DATA = '<NO DATA>';
export default function AccountItem({ user, onActiveClick, onBanClick, onUnbanClick, onDeleteClick, onAssignStudentIdClick }) {
  const { renderStatus } = RenderFunctions();
  const [anchorElActions, setAnchorElActions] = useState(null);
  const location = useLocation();

  function renderActionButtonHandler(action) {
    switch (action) {
      case "ACTIVE":
        return onActiveClick;
      case "BAN":
        return onBanClick;
      case "UNBAN":
        return onUnbanClick;
      case "DELETE":
        return onDeleteClick;
      case "ASSIGN_ID":
        return onAssignStudentIdClick;
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
    <TableRow key={user.userId}>
      <TableCell>{user.userId}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${user.username}`}
          state={{ from: location.pathname }}
          avatar={user.avatar}
          fullName={user.fullName}
        />
      </TableCell>
      <TableCell>
        {user['studentId'] ?? NO_DATA}
      </TableCell>
      <TableCell>
        {renderStatus(user.status)}
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
          {user.status.toLowerCase() === "pending" && renderActionMenu(Actions.pending)}
          {user.status.toLowerCase() === "active" && renderActionMenu(Actions.active)}
          {user.status.toLowerCase() === "banned" && renderActionMenu(Actions.banned)}
        </Menu>
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