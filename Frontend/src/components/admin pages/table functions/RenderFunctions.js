import {TableCell} from "@mui/material";
import React from "react";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import Status from "../item widgets/Status";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import SortedColumnTitle from '../SortedColumnTitle';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

function isExistColumnName(columnName, sortedTitleMap) {
  return Object.values(sortedTitleMap).some((item) => item.name === columnName);
}
function getSortOrderByColumnName(columnName, sortedTitleMap) {
  const foundColumn = Object.values(sortedTitleMap).find((column) => column.name === columnName);
  return foundColumn ? foundColumn.order : '';
}
function renderTableColumnTitle(titleNames, sortedTitleMap, handleSort) {
  return titleNames.map((columnName) => {
    if (isExistColumnName(columnName, sortedTitleMap)) {
      return (
        <TableCell key={columnName}>
          <SortedColumnTitle
            titleText={columnName}
            sortOrder={getSortOrderByColumnName(columnName, sortedTitleMap)}
            onSortClick={() => handleSort(columnName)}
          />
        </TableCell>
      );
    } else {
      return (
        <TableCell key={columnName}><strong>{columnName}</strong></TableCell>
      );
    }
  });
}
function renderStatus(status) {
  const statusText = status.toLowerCase();
  switch (statusText) {
    case 'pending':
      return (
        <Status
          statusColor="#ffc107"
          statusIcon={<PendingOutlinedIcon />}
          statusText={statusText.charAt(0).toUpperCase() + statusText.slice(1)}
        />
      );
    case 'active':
      return (
        <Status
          statusColor="success.main"
          statusIcon={<CheckCircleOutlinedIcon />}
          statusText={statusText.charAt(0).toUpperCase() + statusText.slice(1)}
        />
      );
    case 'archived':
      return (
        <Status
          statusColor="#ffc107"
          statusIcon={<ArchiveOutlinedIcon />}
          statusText={statusText.charAt(0).toUpperCase() + statusText.slice(1)}
        />
      );
    case 'banned':
      return (
        <Status
          statusColor="error.main"
          statusIcon={<BlockOutlinedIcon />}
          statusText={statusText.charAt(0).toUpperCase() + statusText.slice(1)}
        />
      );
    default:
      return null;
  }
}
function renderActionButtonColor(action) {
  switch (action.toLowerCase()) {
    case "active":
    case "assign_id":
      return "secondary";
    case "archive":
    case "ban":
      return "primary";
    case "delete":
      return "error";
    default:
      return "inherit"
  }
}
function renderActionButtonIcon(action) {
  switch (action.toLowerCase()) {
    case "active":
      return <HowToRegIcon />;
    case "assign_id":
      return <AssignmentIndIcon />;
    case "ban":
      return <LockPersonIcon />;
    case "archive":
      return <ArchiveIcon />;
    case "unban":
      return <LockOpenIcon />;
    case "restore":
      return <RestoreIcon />;
    case "delete":
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
    renderActionButtonColor,
    renderActionButtonIcon,
    formatDateTime,
  };
}