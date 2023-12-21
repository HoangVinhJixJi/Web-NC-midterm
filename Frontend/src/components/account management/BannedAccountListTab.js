import {
  Avatar, Button,
  Container,
  Grid,
  ListItemAvatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import React, {useState} from "react";
import RenderFunctions from "./table functions/RenderFunctions";
import {Link} from "react-router-dom";

const titleNames = [ "User ID", "User Info", "Start Time", "End Time", "Action", "Details" ];
const accounts = [
  {
    userId: "182130350350365060",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Anh",
    startTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    endTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    username: "nht2610"
  },
  {
    userId: "182130319550365160",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Bình",
    startTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    endTime: "Forever",
    username: "nht2002"
  },
  {
    userId: "182130350350362391",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Cảnh",
    startTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    endTime: "Forever",
    username: "nht2002"
  },
  {
    userId: "182130350350210458",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Anh",
    startTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    endTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    username: "nht2610"
  },
  {
    userId: "182130748502140542",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Bình",
    startTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    endTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    username: "nht2610"
  },
  {
    userId: "182130310550195391",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Cảnh",
    startTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    endTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    username: "nht2610"
  },
  {
    userId: "182130151180365060",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Anh",
    startTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    endTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    username: "nht2610"
  },
  {
    userId: "182116050350247054",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Bình",
    startTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    endTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    username: "nht2610"
  },
  {
    userId: "182156750240361191",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Cảnh",
    startTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    endTime: "Thu Dec 21 2023 20:56:41 GMT+0700",
    username: "nht2610"
  }
];
export default function BannedAccountListTab() {
  const { renderTableColumnTitle, sortTable } = RenderFunctions();
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'
  const [sortedBy, setSortedBy] = useState(null); // null hoặc tên column đang sắp xếp

  function handleSort(columnName) {
    if (sortedBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
    }
    setSortedBy(columnName);
  }
  function renderAccountList(accounts) {
    const sortedAccounts = [...accounts].sort((a, b) => sortTable(a, b, sortedBy, sortOrder));
    return sortedAccounts.map((account) => (
      <TableRow key={account.userId}>
        <TableCell>{account.userId}</TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ListItemAvatar>
              <Avatar src={account.avatar} alt={account.fullName} />
            </ListItemAvatar>
            {account.fullName}
          </Stack>
        </TableCell>
        <TableCell>
          {account.startTime}
        </TableCell>
        <TableCell>
          {account.endTime}
        </TableCell>
        <TableCell>
          <Button variant="contained" color="inherit" sx={{marginBottom: 1}}>
            Unban
          </Button>
          <Button variant="contained" color="error">
            Delete
          </Button>
        </TableCell>
        <TableCell>
          <Link to={`mangement/account/details/${account.username}`} underline="hover">
            {account.username}
          </Link>
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {renderTableColumnTitle(titleNames, handleSort)}
              </TableRow>
            </TableHead>
            <TableBody>
              {renderAccountList(accounts)}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}