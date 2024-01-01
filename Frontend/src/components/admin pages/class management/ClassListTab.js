import {
  Container,
  FormControlLabel,
  Grid,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import SearchBar from '../../search and filter/SearchBar';
import Filter from '../../search and filter/Filter';
import LoadingDataItem from '../LoadingDataItem';
import NoResultsFoundItem from '../NoResultsFoundItem';
import AdminPagination from '../AdminPagination';
import React, {useEffect, useState} from 'react';
import RenderFunctions from '../table functions/RenderFunctions';
import {useNavigate} from 'react-router-dom';
import ClassItem from './table item/ClassItem';
import api, {setAuthToken} from '../../../api/api';

const titleNames = ['Class ID', 'Class Name', 'Creator', 'Status', 'Action', 'Details'];
const status = ["Active", "Archivated"];
const actions = ["RESTORE", "ARCHIVE", "DELETE"];
export default function ClassListTab() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const [isDisplayFilterSide, setIsDisplayFilterSide] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isDisplayClearStatusButton, setIsDisplayClearStatusButton] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [isDisplayClearActionButton, setIsDisplayClearActionButton] = useState(false);
  const { renderTableColumnTitle } = RenderFunctions();
  const [sortedTitleMap, setSortedTitleMap] = useState({
    sortByClassId: { name: 'Class ID', query: 'classId', order: 'asc' },
    sortByClassName: { name: 'Class Name', query: 'className', order: '' },
    sortByCreator: { name: 'Creator', query: 'creator.fullName', order: '' },
  });
  const [sortOrder, setSortOrder] = useState(sortedTitleMap.sortByClassId.order); // 'asc' hoặc 'desc'
  const [sortedBy, setSortedBy] = useState(sortedTitleMap.sortByClassId.query);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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
  function renderClassList(classes) {
    return classes.map((_class) => (<ClassItem _class={_class} />));
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
        let url = `/admin/management/class?pageSize=10&&sortedBy=${sortedBy}&&sortOrder=${sortOrder}`;
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
        setClasses(response.data['classes']);
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
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', gap: 1.5 }}>
        <FormControlLabel
          control={<Switch checked={isDisplayFilterSide} onChange={handleFilterSwitchChange} />}
          label="Filters" labelPlacement="start"
          sx={{ marginLeft: 0 }}
        />
        <SearchBar
          placeholder="Search Class ID, Name"
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
                {renderTableColumnTitle(titleNames, sortedTitleMap, handleSort)}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? <LoadingDataItem colSpan={titleNames.length} />
                : classes.length > 0
                  ? renderClassList(classes) : <NoResultsFoundItem colSpan={titleNames.length} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <AdminPagination count={totalPages} curPage={currentPage} onPageChange={handlePageChange} />
    </Container>
  );
}