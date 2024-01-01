import {TableCell, TableRow} from "@mui/material";
import React from "react";
import UserInfo from "../../../item widgets/UserInfo";
import DetailsLink from "../../../item widgets/DetailsLink";

export default function TeachingClassItem({ _class }) {
  return (
    <TableRow key={_class['classInfo']['classId']}>
      <TableCell>{_class['classInfo']['classId']}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${_class['classInfo']['creator']['username']}`}
          avatar={_class['classInfo']['creator']['avatar']}
          fullName={_class['classInfo']['creator']['fullName']}
        />
      </TableCell>
      <TableCell>
        {_class['user']['timeOfParticipation']}
      </TableCell>
      <TableCell>
        <DetailsLink linkTo={`/management/class/details/${_class['classInfo']['classId']}`} />
      </TableCell>
    </TableRow>
  );
}