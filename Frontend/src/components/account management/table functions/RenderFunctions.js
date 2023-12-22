import {TableCell} from "@mui/material";
import React from "react";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import Status from "../table item/column/Status";

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
  console.log(sortOrder);
  if (sortedBy === 'User Info') {
    const lastNameA = a.fullName.split(' ').pop().toLowerCase();
    const lastNameB = b.fullName.split(' ').pop().toLowerCase();
    return sortOrder === 'asc' ? lastNameA.localeCompare(lastNameB) : lastNameB.localeCompare(lastNameA);
  }
  // Các trường hợp sắp xếp khác
}
export default function RenderFunctions() {
  return { renderTableColumnTitle, renderStatus, sortTable };
}