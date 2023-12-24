import {
  Container,
  Grid, Table, TableBody,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import React, {useEffect, useState} from "react";
import RenderFunctions from "./table functions/RenderFunctions";
import AccountItem from "./table item/account item/AccountItem";
import NoResultsFoundItem from "./table item/NoResultsFoundItem";
import SearchBar from "../../search and filter/SearchBar";
import Filter from "../../search and filter/Filter";
import AdminPagination from "./AdminPagination";

const titleNames = [ "User ID", "User Info", "Status", "Action", "Details" ];
const status = ["Pending", "Active", "Banned"];
const actions = ["ACTIVE", "BAN", "UNBAN", "DELETE"];
export default function AccountListTab() {
  const [accounts, setAccounts] = useState([
    {
      userId: "182130350350365060",
      avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
      fullName: "Nguyễn Văn Anh",
      status: "Pending",
      username: "nht2610"
    },
    {
      userId: "182130350350214054",
      avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
      fullName: "Nguyễn Văn Bình",
      status: "Active",
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
      userId: "182130350350210458",
      avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
      fullName: "Nguyễn Văn Anh",
      status: "Pending",
      username: "nht2610"
    },
    {
      userId: "182130748502140542",
      avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
      fullName: "Nguyễn Văn Bình",
      status: "Active",
      username: "nht2002"
    },
    {
      userId: "182130310550195391",
      avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
      fullName: "Nguyễn Văn Cảnh",
      status: "Banned",
      username: "huutruc26"
    },
    {
      userId: "182130151180365060",
      avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
      fullName: "Nguyễn Văn Anh",
      status: "Pending",
      username: "nht2610"
    },
    {
      userId: "182116050350247054",
      avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
      fullName: "Nguyễn Văn Bình",
      status: "Active",
      username: "nht2002"
    },
    {
      userId: "182156750240361191",
      avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
      fullName: "Nguyễn Văn Cảnh",
      status: "Banned",
      username: "huutruc26"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDisplayFilterSide, setIsDisplayFilterSide] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isDisplayClearStatusButton, setIsDisplayClearStatusButton] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [isDisplayClearActionButton, setIsDisplayClearActionButton] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const { renderTableColumnTitle, sortTable, filterAccounts } = RenderFunctions();
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
  function handleActiveClick(userId) {
    const updatedAccounts = accounts.map((account) => {
      return account.userId === userId ? {...account, status: 'Active'} : account;
    });
    const updatedFilteredAccounts = filteredAccounts.filter((account) => account.userId !== userId);
    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedFilteredAccounts);
  }
  function handleBanClick(userId) {
    const updatedAccounts = accounts.map((account) => {
      return account.userId === userId ? {...account, status: 'Banned'} : account;
    });
    const updatedFilteredAccounts = filteredAccounts.filter((account) => account.userId !== userId);
    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedFilteredAccounts);
  }
  function handleUnbanClick(userId) {
    const updatedAccounts = accounts.map((account) => {
      return account.userId === userId ? {...account, status: 'Active'} : account;
    });
    const updatedFilteredAccounts = filteredAccounts.filter((account) => account.userId !== userId);
    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedFilteredAccounts);
  }
  function handleDeleteClick(userId) {
    const updatedAccounts = accounts.filter((account) => account.userId !== userId);
    const updatedFilteredAccounts = filteredAccounts.filter((account) => account.userId !== userId);
    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedFilteredAccounts);
  }
  function renderAccountList(accounts) {
    const sortedAccounts = [...accounts].sort((a, b) => sortTable(a, b, sortedBy, sortOrder));
    return sortedAccounts.map((account) => (
      <AccountItem
        user={account}
        onActiveClick={() => handleActiveClick(account.userId)}
        onBanClick={() => handleBanClick(account.userId)}
        onUnbanClick={() => handleUnbanClick(account.userId)}
        onDeleteClick={() => handleDeleteClick(account.userId)}
      />
    ));
  }
  function handleSearchClick() {
    setIsDisplayFilterSide(true);
  }
  function handleFilterByStatusSelect(event) {
    setSelectedStatus(event.target.value);
    setIsDisplayClearStatusButton(true);
    setFilteredAccounts(filterAccounts(accounts, { status: event.target.value, action: selectedAction }));
  }
  function handleFilterByActionSelect(event) {
    setSelectedAction(event.target.value);
    setIsDisplayClearActionButton(true);
    setFilteredAccounts(filterAccounts(accounts, { action: event.target.value, status: selectedStatus }));
  }
  function handleClearStatusClick() {
    setSelectedStatus("");
    setIsDisplayClearStatusButton(false);
    setFilteredAccounts(filterAccounts(accounts, { action: selectedAction }));
  }
  function handleClearActionClick() {
    setSelectedAction("");
    setIsDisplayClearActionButton(false);
    setFilteredAccounts(filterAccounts(accounts, { status: selectedStatus }));
  }

  useEffect(() => {

  }, []);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1.5 }}>
        <SearchBar
          placeholder="Search User ID, Name"
          searchTerm={searchTerm}
          onSearchTermChange={(e) => setSearchTerm(e.target.value)}
          onSearchClick={handleSearchClick}
        />
        {isDisplayFilterSide &&
          <>
            <Filter
              name="Status"
              options={status}
              isDisplayClearButton={isDisplayClearStatusButton}
              onClearClick={handleClearStatusClick}
              selectedOption={selectedStatus}
              onFilterSelect={handleFilterByStatusSelect}
            />
            <Filter
              name="Action"
              options={actions}
              isDisplayClearButton={isDisplayClearActionButton}
              onClearClick={handleClearActionClick}
              selectedOption={selectedAction}
              onFilterSelect={handleFilterByActionSelect}
            />
          </>
        }
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
              {isDisplayClearStatusButton || isDisplayClearActionButton
                ? filteredAccounts.length > 0 ? renderAccountList(filteredAccounts) : <NoResultsFoundItem colSpan={5} />
                : accounts.length > 0 ? renderAccountList(accounts) : <NoResultsFoundItem colSpan={5} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <AdminPagination count={10} />
    </Container>
  );
}