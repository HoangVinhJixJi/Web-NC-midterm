import {Button, Menu, TableCell, TableRow} from "@mui/material";
import React, {useState} from "react";
import RenderFunctions from "../../table functions/RenderFunctions";
import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from "@mui/material/MenuItem";
import DetailsLink from "../item widgets/DetailsLink";
import UserInfo from "../item widgets/UserInfo";
import ActionButton from "../item widgets/ActionButton";

const Actions = {
  pending: ["ACTIVE"],
  active: ["BAN"],
  banned: ["UNBAN", "DELETE"]
}
export default function AccountItem({ user, onActiveClick, onBanClick, onUnbanClick, onDeleteClick }) {
  const { renderStatus } = RenderFunctions();
  const [anchorElActions, setAnchorElActions] = useState(null);

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
          avatar={user.avatar}
          fullName={user.fullName}
        />
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
          {user.status === "Pending" && renderActionMenu(Actions.pending)}
          {user.status === "Active" && renderActionMenu(Actions.active)}
          {user.status === "Banned" && renderActionMenu(Actions.banned)}
        </Menu>
      </TableCell>
      <TableCell>
        <DetailsLink linkTo={`/management/account/details/${user.username}`} />
      </TableCell>
    </TableRow>
  );
}