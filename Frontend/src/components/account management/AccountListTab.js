import {
  Avatar, Button,
  Container,
  Grid, ListItemAvatar, Stack,
  Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";
import RenderFunctions from "./table functions/RenderFunctions";

const titleNames = [ "User ID", "User Info", "Status", "Action", "Details" ];
const accounts = [
  {
    userId: "1821303503503650600",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Anh",
    status: "Pending",
    username: "nht2610"
  },
  {
    userId: "182130350350214054",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Bình",
    status: "Activated",
    username: "nht2002"
  },
  {
    userId: "182130350350362391",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Cảnh",
    status: "Banned",
    username: "huutruc26"
  },
  {
    userId: "1821303503503650600",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Anh",
    status: "Pending",
    username: "nht2610"
  },
  {
    userId: "182130350350214054",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Bình",
    status: "Activated",
    username: "nht2002"
  },
  {
    userId: "182130350350362391",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Cảnh",
    status: "Banned",
    username: "huutruc26"
  },
  {
    userId: "1821303503503650600",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Anh",
    status: "Pending",
    username: "nht2610"
  },
  {
    userId: "182130350350214054",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Bình",
    status: "Activated",
    username: "nht2002"
  },
  {
    userId: "182130350350362391",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Cảnh",
    status: "Banned",
    username: "huutruc26"
  }
];
export default function AccountListTab() {
  const { renderTableColumnTitle, renderStatus } = RenderFunctions();
  function renderAccountList(accounts) {
    return accounts.map((account) => (
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
          {renderStatus(account.status)}
        </TableCell>
        <TableCell>
          {account.status === 'Pending' && (
            <Button variant="contained" color="success">
              Active
            </Button>
          )}
          {account.status === 'Activated' && (
            <Button variant="contained" color="primary">
              Ban
            </Button>
          )}
          {account.status === 'Banned' && (
            <Button variant="contained" color="inherit">
              Unban
            </Button>
          )}
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
                {renderTableColumnTitle(titleNames)}
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