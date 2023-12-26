import {
  Container, FormControlLabel,
  Grid, Switch, Table, TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React, {useEffect, useState} from "react";
import RenderFunctions from "./table functions/RenderFunctions";
import AccountItem from "./table item/account item/AccountItem";
import NoResultsFoundItem from "./table item/NoResultsFoundItem";
import SearchBar from "../../search and filter/SearchBar";
import Filter from "../../search and filter/Filter";
import AdminPagination from "./AdminPagination";
import {useNavigate} from "react-router-dom";
import api, {setAuthToken} from "../../../api/api";
import LoadingDataItem from "./table item/LoadingDataItem";

const titleNames = [ "User ID", "User Info", "Status", "Action", "Details" ];
const status = ["Pending", "Active", "Banned"];
const actions = ["ACTIVE", "BAN", "UNBAN", "DELETE"];
export default function AccountListTab() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const [isDisplayFilterSide, setIsDisplayFilterSide] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isDisplayClearStatusButton, setIsDisplayClearStatusButton] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [isDisplayClearActionButton, setIsDisplayClearActionButton] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const { renderTableColumnTitle, sortTable } = RenderFunctions();
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'
  const [sortedBy, setSortedBy] = useState(null); // null hoặc tên column đang sắp xếp
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  function handleSort(columnName) {
    if (sortedBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
    }
    setSortedBy(columnName);
  }
  function handleFilterSwitchChange() {
    setIsDisplayFilterSide(isDisplayFilterSide => !isDisplayFilterSide);
  }
  function handleActiveClick(userId) {
    const updatedAccounts = accounts.map((account) => {
      return account['userId'] === userId ? {...account, status: 'Active'} : account;
    });
    const updatedFilteredAccounts = filteredAccounts.filter((account) => account['userId'] !== userId);
    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedFilteredAccounts);
  }
  function handleBanClick(userId) {
    const updatedAccounts = accounts.map((account) => {
      return account['userId'] === userId ? {...account, status: 'Banned'} : account;
    });
    const updatedFilteredAccounts = filteredAccounts.filter((account) => account['userId'] !== userId);
    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedFilteredAccounts);
  }
  function handleUnbanClick(userId) {
    const updatedAccounts = accounts.map((account) => {
      return account['userId'] === userId ? {...account, status: 'Active'} : account;
    });
    const updatedFilteredAccounts = filteredAccounts.filter((account) => account['userId'] !== userId);
    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedFilteredAccounts);
  }
  function handleDeleteClick(userId) {
    const updatedAccounts = accounts.filter((account) => account['userId'] !== userId);
    const updatedFilteredAccounts = filteredAccounts.filter((account) => account['userId'] !== userId);
    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedFilteredAccounts);
  }
  function renderAccountList(accounts) {
    const sortedAccounts = [...accounts].sort((a, b) => sortTable(a, b, sortedBy, sortOrder));
    return sortedAccounts.map((account) => (
      <AccountItem
        user={account}
        onActiveClick={() => handleActiveClick(account['userId'])}
        onBanClick={() => handleBanClick(account['userId'])}
        onUnbanClick={() => handleUnbanClick(account['userId'])}
        onDeleteClick={() => handleDeleteClick(account['userId'])}
      />
    ));
  }
  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setIsDisplayClearStatusButton(false);
      setIsDisplayClearActionButton(false);
      setIsSearchEnabled(false);
      setCurrentPage(1);
      setTotalPages(0);
    } else {
      setIsSearchEnabled(true);
    }
  }
  function handleSearchClick() {
    setIsSearchClick(isSearchClick => !isSearchClick);
    setIsDisplayFilterSide(true);
    setCurrentPage(1);
  }
  function handleFilterByStatusSelect(event) {
    setSelectedStatus(event.target.value);
    setIsDisplayClearStatusButton(true);
    setCurrentPage(1);
  }
  function handleFilterByActionSelect(event) {
    setSelectedAction(event.target.value);
    setIsDisplayClearActionButton(true);
    setCurrentPage(1);
  }
  function handleClearStatusClick() {
    setSelectedStatus("");
    setIsDisplayClearStatusButton(false);
    setCurrentPage(1);
  }
  function handleClearActionClick() {
    setSelectedAction("");
    setIsDisplayClearActionButton(false);
    setCurrentPage(1);
  }
  function handlePageChange(page) {
    setCurrentPage(page);
  }

  useEffect(() => {
    const fetchData = async (searchTerm, selectedStatus, selectedAction, page) => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching user data:', Error);
          navigate('/admin-signin');
        }
        setAuthToken(token);
        let url = `/admin/management/account?`;
        let query = `page=${page}`;
        if (searchTerm !== '') {
          query = query + `&&searchTerm=${searchTerm}`;
        }
        if (selectedStatus !== '') {
          query = query + `&&status=${selectedStatus}`;
        }
        if (selectedAction !== '') {
          query = query + `&&action=${selectedAction}`;
        }
        url = url + query;
        const response = await api.get(url);
        console.log('response.data: ', response.data);
        setAccounts(response.data['accounts']);
        setTotalPages(response.data['totalPages']);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    fetchData(searchTerm, selectedStatus, selectedAction, currentPage);
  }, [currentPage, isSearchClick, selectedStatus, selectedAction]);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '60em' }}>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', gap: 1.5 }}>
        <FormControlLabel
          control={<Switch checked={isDisplayFilterSide} onChange={handleFilterSwitchChange} />}
          label="Filters" labelPlacement="start"
          sx={{ marginLeft: 0 }}
        />
        <SearchBar
          placeholder="Search User ID, Name"
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchChange}
          isButtonSearchEnabled={isSearchEnabled}
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
              {isLoading
                ? <LoadingDataItem colSpan={titleNames.length} />
                : accounts.length > 0
                  ? renderAccountList(accounts) : <NoResultsFoundItem colSpan={titleNames.length} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <AdminPagination count={totalPages} onPageChange={handlePageChange} />
    </Container>
  );
}