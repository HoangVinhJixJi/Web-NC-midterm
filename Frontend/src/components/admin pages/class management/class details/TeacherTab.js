import React, {useEffect, useState} from 'react';
import RenderFunctions from '../../table functions/RenderFunctions';
import {useNavigate} from 'react-router-dom';
import api, {setAuthToken} from '../../../../api/api';
import {Container, Grid, Table, TableBody, TableContainer, TableHead, TableRow} from '@mui/material';
import SearchBar from '../../../search and filter/SearchBar';
import LoadingDataItem from '../../LoadingDataItem';
import NoResultsFoundItem from '../../NoResultsFoundItem';
import TeacherItem from '../table item/participant items/TeacherItem';

const titleNames = ["User ID", "Teacher Info", "Time of Participation", "Details"];
export default function TeacherTab({ classId }) {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const { renderTableColumnTitle } = RenderFunctions();
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'
  const [sortedBy, setSortedBy] = useState(null); // null hoặc tên column đang sắp xếp
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  function handleSort(columnName) {
    if (sortedBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
    }
    setSortedBy(columnName);
  }
  function renderClassList(teachers) {
    return teachers.map((teacher) => (<TeacherItem teacher={teacher} />));
  }
  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setIsSearchEnabled(false);
      setIsSearchClick(isSearchClick => !isSearchClick);
    } else {
      setIsSearchEnabled(true);
    }
  }
  function handleSearchClick() {
    setIsSearchClick(isSearchClick => !isSearchClick);
  }
  function handleClearClick() {
    setSearchTerm("");
    setIsSearchEnabled(false);
    setIsSearchClick(isSearchClick => !isSearchClick);
  }

  useEffect(() => {
    const fetchData = async (searchTerm) => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching teachers data:', Error);
          navigate('/admin-signin');
        }
        setAuthToken(token);
        let url = `/admin/management/class/teacher?classId=${classId}`;
        let query = '';
        if (searchTerm !== '') {
          query = query + `&&searchTerm=${searchTerm}`;
        }
        url = url + query;
        const response = await api.get(url);
        console.log('response.data: ', response.data);
        setTeachers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    fetchData(searchTerm);
  }, [isSearchClick]);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '57em' }}>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1.5 }}>
        <SearchBar
          placeholder="Search Teacher Name"
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchChange}
          isButtonSearchEnabled={isSearchEnabled}
          onSearchClick={handleSearchClick}
          onClearClick={handleClearClick}
        />
      </Container>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
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
                : teachers.length > 0
                  ? renderClassList(teachers) : <NoResultsFoundItem colSpan={titleNames.length} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}