import {
  Container,
  Grid, Table, TableBody,
  TableContainer, TableHead,
  TableRow
} from "@mui/material";
import RenderFunctions from "../table functions/RenderFunctions";
import React, {useEffect, useState} from "react";
import ActivatedAccountItem from "./table item/account item/ActivatedAccountItem";
import SearchBar from "../../search and filter/SearchBar";
import AdminPagination from "../AdminPagination";
import {useNavigate} from "react-router-dom";
import api, {setAuthToken} from "../../../api/api";
import LoadingDataItem from "../LoadingDataItem";
import NoResultsFoundItem from "../NoResultsFoundItem";
import BanAccountDialog from './dialogs/BanAccountDialog';

const titleNames = [ "User ID", "User Info", "Action", "Details" ];
export default function ActivatedAccountListTab() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const { renderTableColumnTitle } = RenderFunctions();
  const [sortedTitleMap, setSortedTitleMap] = useState({
    sortByUserId: { name: 'User ID', query: 'userId', order: 'asc' },
    sortByUserInfo: { name: 'User Info', query: 'fullName', order: '' },
  });
  const [sortOrder, setSortOrder] = useState(sortedTitleMap.sortByUserId.order); // 'asc' hoặc 'desc'
  const [sortedBy, setSortedBy] = useState(sortedTitleMap.sortByUserId.query);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenBanAccountDialog, setIsOpenBanAccountDialog] = useState(false);
  const [actionUserId, setActionUserId] = useState('');
  const [actionUsername, setActionUsername] = useState('');
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
  function handleBanClick(userId, username) {
    setActionUserId(userId);
    setActionUsername(username);
    setIsOpenBanAccountDialog(true);
  }
  function renderAccountList(accounts) {
    return accounts.map((account) => (
      <ActivatedAccountItem
        user={account}
        onBanClick={() => handleBanClick(account['userId'], account['username'])}
      />
    ));
  }
  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
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
    setCurrentPage(1);
  }
  function handlePageChange(page) {
    setCurrentPage(page);
  }
  function handleCloseBanAccountDialog(userId) {
    setIsOpenBanAccountDialog(false);
    if (isSuccess) {
      const updatedAccounts = accounts.filter((account) => account['userId'] !== userId);
      setAccounts(updatedAccounts);
    }
    setIsSuccess(false);
  }

  useEffect(() => {
    const fetchData = async (searchTerm, page, sortedBy, sortOrder) => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching user data:', Error);
          navigate('/admin-signin');
        }
        setAuthToken(token);
        let url = `/admin/management/account?sortedBy=${sortedBy}&&sortOrder=${sortOrder}`;
        let query = `&&status=Active&&page=${page}`;
        if (searchTerm !== '') {
          query = query + `&&searchTerm=${searchTerm}`;
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
    fetchData(searchTerm, currentPage, sortedBy, sortOrder);
  }, [currentPage, isSearchClick, sortedBy, sortOrder]);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '60em' }}>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1.5 }}>
        <SearchBar
          placeholder="Search User ID, Name"
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchChange}
          isButtonSearchEnabled={isSearchEnabled}
          onSearchClick={handleSearchClick}
        />
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
              {isLoading ? <LoadingDataItem colSpan={titleNames.length} />
                : accounts.length > 0
                  ? renderAccountList(accounts)
                  : <NoResultsFoundItem colSpan={titleNames.length} />}
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
    </Container>
  );
}