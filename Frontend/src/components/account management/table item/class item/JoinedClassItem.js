import {TableCell, TableRow} from "@mui/material";
import UserInfo from "../item widgets/UserInfo";
import DetailsLink from "../item widgets/DetailsLink";
import React from "react";

export default function JoinedClassItem({ _class }) {
  return (
    <TableRow key={_class.classInfo.classId}>
      <TableCell>{_class.classInfo.className}</TableCell>
      <TableCell>
        <UserInfo
          linkTo={`/management/account/details/${_class.classInfo.creator.username}`}
          avatar={_class.classInfo.creator.avatar}
          fullName={_class.classInfo.creator.fullName}
        />
      </TableCell>
      <TableCell>
        {_class.user.timeOfEnrolling}
      </TableCell>
      <TableCell>
        <DetailsLink linkTo={`/management/class/details/${_class.classInfo.classId}`} />
      </TableCell>
    </TableRow>
  );
}