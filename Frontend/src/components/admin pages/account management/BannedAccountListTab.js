import {
  Container,
  Grid, Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import React, {useState} from "react";
import RenderFunctions from "./table functions/RenderFunctions";
import BannedAccountItem from "./table item/account item/BannedAccountItem";
import SearchBar from "../../search and filter/SearchBar";
import AdminPagination from "./AdminPagination";

const titleNames = [ "User ID", "User Info", "Start Time", "End Time", "Action", "Details" ];
export default function BannedAccountListTab() {
  const [accounts, setAccounts] = useState([
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
  ]);
  const [searchTerm, setSearchTerm] = useState("");
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
  function handleUnbanClick(userId) {
    const updatedAccounts = accounts.map((account) => {
      return account.userId === userId ? {...account, status: 'Active'} : account;
    }).filter((account) => account.userId !== userId);
    setAccounts(updatedAccounts);
  }
  function handleDeleteClick(userId) {
    const updatedAccounts = accounts.filter((account) => account.userId !== userId);
    setAccounts(updatedAccounts);
  }
  function renderAccountList(accounts) {
    const sortedAccounts = [...accounts].sort((a, b) => sortTable(a, b, sortedBy, sortOrder));
    return sortedAccounts.map((account) => (
      <BannedAccountItem
        user={account}
        onUnbanClick={() => handleUnbanClick(account.userId)}
        onDeleteClick={() => handleDeleteClick(account.userId)}
      />
    ));
  }
  function handleSearchClick() {

  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1.5 }}>
        <SearchBar
          placeholder="Search User ID, Name"
          searchTerm={searchTerm}
          onSearchTermChange={(e) => setSearchTerm(e.target.value)}
          onSearchClick={handleSearchClick}
        />
      </Container>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
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
      <AdminPagination count={10} />
    </Container>
  );
}