import {TableCell} from "@mui/material";
import React from "react";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import Status from "../table item/item widgets/Status";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function renderTableColumnTitle(titleNames, handleSort) {
  return titleNames.map((columnName) => (
    <TableCell key={columnName} onClick={() => handleSort(columnName)}>
      <strong>{columnName}</strong>
    </TableCell>
  ));
}
function renderStatus(status) {
  switch (status) {
    case 'Pending':
      return <Status statusColor="#ffc107" statusIcon={<PendingOutlinedIcon />} statusText={status} />;
    case 'Active':
      return <Status statusColor="success.main" statusIcon={<CheckCircleOutlinedIcon />} statusText={status} />;
    case 'Banned':
      return <Status statusColor="error.main" statusIcon={<BlockOutlinedIcon />} statusText={status} />;
    default:
      return null;
  }
}
function sortTable(a, b, sortedBy, sortOrder) {
  if (sortedBy === 'User Info') {
    const lastNameA = a.fullName.split(' ').pop().toLowerCase();
    const lastNameB = b.fullName.split(' ').pop().toLowerCase();
    return sortOrder === 'asc' ? lastNameA.localeCompare(lastNameB) : lastNameB.localeCompare(lastNameA);
  }
  // Các trường hợp sắp xếp khác
}
function filterAccounts(accounts, filter) {
  return accounts.filter((account) => {
    return Object.keys(filter).every(key => {
      switch (key) {
        case "status":
          return filter[key] !== "" ? account[key] === filter[key] : true;
        case "action":
          if (filter[key] !== "") {
            if (filter[key].toLowerCase() === "active" && account.status === "Pending") {
              return true;
            } else if (filter[key].toLowerCase() === "ban" && account.status === "Active") {
              return true;
            } else if (filter[key].toLowerCase() === "unban" && account.status === "Banned") {
              return true;
            } else if (filter[key].toLowerCase() === "delete" && account.status === "Banned") {
              return true;
            }
            return false;
          }
          return true;
        // Các trường hợp lọc khác
        // ...
        default:
          return true;
      }
    });
  });
}
function renderActionButtonColor(action) {
  switch (action) {
    case "ACTIVE":
      return "secondary";
    case "BAN":
      return "primary";
    case "DELETE":
      return "error";
    default:
      return "inherit"
  }
}
function renderActionButtonIcon(action) {
  switch (action) {
    case "ACTIVE":
      return <HowToRegIcon />;
    case "BAN":
      return <LockPersonIcon />;
    case "UNBAN":
      return <LockOpenIcon />;
    case "DELETE":
      return <DeleteForeverIcon />;
    default:
      return null;
  }
}
function formatDateTime(dateTimeString) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  };
  const dateTime = new Date(dateTimeString);
  if (isNaN(dateTime.getTime())) {
    console.error('Invalid date:', dateTimeString);
    return '';
  }
  const locale = navigator.language;
  return new Date(dateTime).toLocaleString(locale, options);
}
export default function RenderFunctions() {
  return {
    renderTableColumnTitle,
    renderStatus,
    sortTable,
    filterAccounts,
    renderActionButtonColor,
    renderActionButtonIcon,
    formatDateTime,
  };
}