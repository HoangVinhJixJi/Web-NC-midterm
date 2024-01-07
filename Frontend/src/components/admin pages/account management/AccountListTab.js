import {
  Button,
  Container, FormControlLabel,
  Grid, ListItemIcon, Stack, Switch, Table, TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React, {useEffect, useState} from "react";
import RenderFunctions from "../table functions/RenderFunctions";
import AccountItem from "./table item/account item/AccountItem";
import NoResultsFoundItem from "../NoResultsFoundItem";
import SearchBar from "../../search and filter/SearchBar";
import Filter from "../../search and filter/Filter";
import AdminPagination from "../AdminPagination";
import {useNavigate} from "react-router-dom";
import api, {setAuthToken} from "../../../api/api";
import LoadingDataItem from "../LoadingDataItem";
import BanAccountDialog from './dialogs/BanAccountDialog';
import UnbanAccountDialog from './dialogs/UnbanAccountDialog';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignStudentIdToAllDialog from './dialogs/AssignStudentIdToAllDialog';
import AssignStudentIdDialog from './dialogs/AssignStudentIdDialog';

const titleNames = [ "User ID", "User Info", "Student ID", "Status", "Action", "Details" ];
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
  const { renderTableColumnTitle } = RenderFunctions();
  const [sortedTitleMap, setSortedTitleMap] = useState({
    sortByUserId: { name: 'User ID', query: 'userId', order: 'asc' },
    sortByUserInfo: { name: 'User Info', query: 'fullName', order: '' },
    sortByStudentId: { name: 'Student ID', query: 'studentId', order: '' },
  });
  const [sortOrder, setSortOrder] = useState(sortedTitleMap.sortByUserId.order); // 'asc' hoặc 'desc'
  const [sortedBy, setSortedBy] = useState(sortedTitleMap.sortByUserId.query);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenBanAccountDialog, setIsOpenBanAccountDialog] = useState(false);
  const [isOpenUnbanAccountDialog, setIsOpenUnbanAccountDialog] = useState(false);
  const [isOpenAssignStudentIdDialog, setIsOpenAssignStudentIdDialog] = useState(false);
  const [isOpenAssignStudentIdToAllDialog, setIsOpenAssignStudentIdToAllDialog] = useState(false);
  const [actionUserId, setActionUserId] = useState('');
  const [actionUsername, setActionUsername] = useState('');
  const [actionUserFullName, setActionUserFullName] = useState('');
  const [actionUserAvatar, setActionUserAvatar] = useState('');
  const [actionStudentId, setActionStudentId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSort(columnName) {
    const updatedTitleMap = { ...sortedTitleMap };
    Object.keys(updatedTitleMap).forEach((key) => {
      if (updatedTitleMap[key].name === columnName) {
        updatedTitleMap[key].order = updatedTitleMap[key].order === 'asc' ? 'desc' : 'asc';
        setSortOrder(updatedTitleMap[key].order);
        setSortedBy(updatedTitleMap[key].query);
      } else {
        updatedTitleMap[key].order = '';
      }
    });
    setSortedTitleMap(updatedTitleMap);
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
  function handleBanClick(userId, username) {
    setActionUserId(userId);
    setActionUsername(username);
    setIsOpenBanAccountDialog(true);
  }
  function handleUnbanClick(userId, username) {
    setActionUserId(userId);
    setActionUsername(username);
    setIsOpenUnbanAccountDialog(true);
  }
  function handleDeleteClick(userId) {
    const updatedAccounts = accounts.filter((account) => account['userId'] !== userId);
    const updatedFilteredAccounts = filteredAccounts.filter((account) => account['userId'] !== userId);
    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedFilteredAccounts);
  }
  function handleAssignStudentIdClick(userId, fullName, avatar, studentId) {
    setActionUserId(userId);
    setActionUserFullName(fullName);
    setActionUserAvatar(avatar);
    console.log(studentId);
    setActionStudentId(studentId ?? '');
    setIsOpenAssignStudentIdDialog(true);
  }
  function handleMapStudentIdsClick() {
    setIsOpenAssignStudentIdToAllDialog(true);
  }
  function renderAccountList(accounts) {
    return accounts.map((account) => (
      <AccountItem
        user={account}
        onActiveClick={() => handleActiveClick(account['userId'])}
        onBanClick={() => handleBanClick(account['userId'], account['username'])}
        onUnbanClick={() => handleUnbanClick(account['userId'], account['username'])}
        onDeleteClick={() => handleDeleteClick(account['userId'])}
        onAssignStudentIdClick={() => handleAssignStudentIdClick(account['userId'], account['fullName'], account['avatar'], account['studentId'])}
      />
    ));
  }
  function handleClearClick() {
    setSearchTerm("");
    setIsDisplayClearStatusButton(false);
    setIsDisplayClearActionButton(false);
    setIsSearchEnabled(false);
    setIsSearchClick(isSearchClick => !isSearchClick);
    setCurrentPage(1);
    setTotalPages(0);
  }
  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setIsDisplayClearStatusButton(false);
      setIsDisplayClearActionButton(false);
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
  function handleCloseBanAccountDialog(userId) {
    setIsOpenBanAccountDialog(false);
    if (isSuccess) {
      const updatedAccounts = accounts.map((account) => {
        return account['userId'] === userId ? {...account, status: 'Banned'} : account;
      });
      setAccounts(updatedAccounts);
    }
    setIsSuccess(false);
  }
  function handleCloseUnbanAccountDialog(userId) {
    setIsOpenUnbanAccountDialog(false);
    if (isSuccess) {
      const updatedAccounts = accounts.map((account) => {
        return account['userId'] === userId ? {...account, status: 'Active'} : account;
      });
      setAccounts(updatedAccounts);
    }
    setIsSuccess(false);
  }
  function handleCloseAssignStudentIdDialog(userId, studentId) {
    setIsOpenAssignStudentIdDialog(false);
    if (isSuccess) {
      const updatedAccounts = accounts.map(account => {
        return account['userId'] === userId ? {...account, studentId: studentId} : account;
      });
      setAccounts(updatedAccounts);
    }
    setIsSuccess(false);
  }
  function handleCloseAssignStudentIdToAllDialog(data) {
    setIsOpenAssignStudentIdToAllDialog(false);
    if (isSuccess) {
      const updatedAccounts = accounts.map(account => {
        const correspondingUser = data.find(item => item.userId === account.userId);
        if (correspondingUser) {
          return { ...account, studentId: correspondingUser.studentId };
        }
        return account;
      });
      setAccounts(updatedAccounts);
    }
    setIsSuccess(false);
  }

  useEffect(() => {
    const fetchData = async (searchTerm, selectedStatus, selectedAction, page, sortedBy, sortOrder) => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching user data:', Error);
          navigate('/admin-signin');
        }
        setAuthToken(token);
        let url = `/admin/management/account?sortedBy=${sortedBy}&&sortOrder=${sortOrder}`;
        let query = `&&page=${page}`;
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
    fetchData(searchTerm, selectedStatus, selectedAction, currentPage, sortedBy, sortOrder);
  }, [currentPage, isSearchClick, selectedStatus, selectedAction, sortedBy, sortOrder]);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '60em' }}>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', gap: 1 }}>
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
          onClearClick={handleClearClick}
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
        <Button
          variant="contained" color="primary"
          sx={{ height: 40, alignSelf: 'center' }}
          onClick={handleMapStudentIdsClick}
        >
          <Stack direction="row" alignItems="center">
            <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
              <AssignmentIcon />
            </ListItemIcon>
            {!isDisplayFilterSide && 'Assign Student_IDs'}
          </Stack>
        </Button>
      </Container>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {renderTableColumnTitle(titleNames, sortedTitleMap, handleSort)}
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
      <AdminPagination count={totalPages} curPage={currentPage} onPageChange={handlePageChange} />
      <BanAccountDialog
        userId={actionUserId}
        username={actionUsername}
        isOpenBanAccountDialog={isOpenBanAccountDialog}
        onCloseBanAccountDialog={handleCloseBanAccountDialog}
        setIsSuccess={setIsSuccess}
      />
      <UnbanAccountDialog
        userId={actionUserId}
        username={actionUsername}
        isOpenUnbanAccountDialog={isOpenUnbanAccountDialog}
        onCloseUnbanAccountDialog={handleCloseUnbanAccountDialog}
        setIsSuccess={setIsSuccess}
      />
      <AssignStudentIdDialog
        userId={actionUserId} fullName={actionUserFullName} avatar={actionUserAvatar} _studentId={actionStudentId}
        isOpenAssignStudentIdDialog={isOpenAssignStudentIdDialog}
        onCloseAssignStudentIdDialog={handleCloseAssignStudentIdDialog}
        setIsSuccess={setIsSuccess}
      />
      <AssignStudentIdToAllDialog
        isOpenAssignStudentIdToAllDialog={isOpenAssignStudentIdToAllDialog}
        onCloseAssignStudentIdToAllDialog={handleCloseAssignStudentIdToAllDialog}
        setIsSuccess={setIsSuccess}
      />
    </Container>
  );
}