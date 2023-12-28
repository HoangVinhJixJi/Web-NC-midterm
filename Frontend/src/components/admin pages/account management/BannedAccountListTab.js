import {
  Container, FormControlLabel,
  Grid, Switch, Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React, {useEffect, useState} from "react";
import RenderFunctions from "./table functions/RenderFunctions";
import BannedAccountItem from "./table item/account item/BannedAccountItem";
import SearchBar from "../../search and filter/SearchBar";
import AdminPagination from "./AdminPagination";
import {useNavigate} from "react-router-dom";
import LoadingDataItem from "./table item/LoadingDataItem";
import NoResultsFoundItem from "./table item/NoResultsFoundItem";
import api, {setAuthToken} from "../../../api/api";
import Filter from '../../search and filter/Filter';
import UnbanAccountDialog from './dialogs/UnbanAccountDialog';

const titleNames = [ "User ID", "User Info", "Total Days Banned", "Start Time", "End Time", "Action", "Details" ];
const totalDaysBanned = ["1 day", "7 days", "30 days", "Forever"];
export default function BannedAccountListTab() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const [isDisplayFilterSide, setIsDisplayFilterSide] = useState(false);
  const [selectedTotalDaysBanned, setSelectedTotalDaysBanned] = useState("");
  const [isDisplayClearTDBButton, setIsDisplayClearTDBButton] = useState(false);
  const { renderTableColumnTitle, sortTable } = RenderFunctions();
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'
  const [sortedBy, setSortedBy] = useState(null); // null hoặc tên column đang sắp xếp
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenUnbanAccountDialog, setIsOpenUnbanAccountDialog] = useState(false);
  const [actionUserId, setActionUserId] = useState('');
  const [actionUsername, setActionUsername] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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
  function handleUnbanClick(userId, username) {
    setActionUserId(userId);
    setActionUsername(username);
    setIsOpenUnbanAccountDialog(true);
  }
  function handleDeleteClick(userId) {
    const updatedAccounts = accounts.filter((account) => account['userInfo']['_id'] !== userId);
    setAccounts(updatedAccounts);
  }
  function renderAccountList(accounts) {
    const sortedAccounts = [...accounts].sort((a, b) => sortTable(a, b, sortedBy, sortOrder));
    return sortedAccounts.map((account) => (
      <BannedAccountItem
        user={account}
        onUnbanClick={() => handleUnbanClick(account['userInfo']['_id'], account['userInfo']['username'])}
        onDeleteClick={() => handleDeleteClick(account['userInfo']['_id'])}
      />
    ));
  }
  function handleFilterByTDBSelect(event) {
    setSelectedTotalDaysBanned(event.target.value);
    setIsDisplayClearTDBButton(true);
    setCurrentPage(1);
  }
  function handleClearTDBClick() {
    setSelectedTotalDaysBanned("");
    setIsDisplayClearTDBButton(false);
    setCurrentPage(1);
  }
  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setIsDisplayClearTDBButton(false);
      setIsSearchEnabled(false);
      setIsSearchClick(isSearchClick => !isSearchClick);
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
  function handlePageChange(page) {
    setCurrentPage(page);
  }
  function handleCloseUnbanAccountDialog(userId) {
    setIsOpenUnbanAccountDialog(false);
    if (isSuccess) {
      const updatedAccounts = accounts.filter((account) => account['userInfo']['_id'] !== userId);
      setAccounts(updatedAccounts);
    }
    setIsSuccess(false);
  }

  useEffect(() => {
    const fetchData = async (searchTerm, selectedTotalDaysBanned, page) => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching user data:', Error);
          navigate('/admin-signin');
        }
        setAuthToken(token);
        let url = `/admin/management/account/banned?`;
        let query = `page=${page}`;
        if (searchTerm !== '') {
          query = query + `&&searchTerm=${searchTerm}`;
        }
        if (selectedTotalDaysBanned !== '') {
          query = query + `&&totalDaysBanned=${selectedTotalDaysBanned}`;
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
    fetchData(searchTerm, selectedTotalDaysBanned, currentPage);
  }, [currentPage, selectedTotalDaysBanned, isSearchClick]);

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
              name="Total Days Banned"
              options={totalDaysBanned}
              isDisplayClearButton={isDisplayClearTDBButton}
              onClearClick={handleClearTDBClick}
              selectedOption={selectedTotalDaysBanned}
              onFilterSelect={handleFilterByTDBSelect}
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
              {isLoading ? <LoadingDataItem colSpan={titleNames.length} />
                : accounts.length > 0
                  ? renderAccountList(accounts)
                  : <NoResultsFoundItem colSpan={titleNames.length} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <AdminPagination count={totalPages} onPageChange={handlePageChange} />
      <UnbanAccountDialog
        userId={actionUserId}
        username={actionUsername}
        isOpenUnbanAccountDialog={isOpenUnbanAccountDialog}
        onCloseUnbanAccountDialog={handleCloseUnbanAccountDialog}
        setIsSuccess={setIsSuccess}
      />
    </Container>
  );
}