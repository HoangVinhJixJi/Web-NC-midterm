import React, {useEffect, useState} from 'react';
import RenderFunctions from '../../table functions/RenderFunctions';
import {useNavigate} from 'react-router-dom';
import api, {setAuthToken} from '../../../../api/api';
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import SearchBar from '../../../search and filter/SearchBar';
import LoadingDataItem from '../../LoadingDataItem';
import NoResultsFoundItem from '../../NoResultsFoundItem';
import StudentItem from '../table item/participant items/StudentItem';
import AssignStudentIdDialog from '../../account management/dialogs/AssignStudentIdDialog';

const titleNames = ["User ID", "Student Info", "Time of Participation", "Student ID", "Action", "Details"];
export default function StudentTab({ classId }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const { renderTableColumnTitle } = RenderFunctions();
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'
  const [sortedBy, setSortedBy] = useState(null); // null hoặc tên column đang sắp xếp
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState('');
  const [actionUserFullName, setActionUserFullName] = useState('');
  const [actionUserAvatar, setActionUserAvatar] = useState('');
  const [actionStudentId, setActionStudentId] = useState('');
  const [isOpenAssignStudentIdDialog, setIsOpenAssignStudentIdDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSort(columnName) {
    if (sortedBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
    }
    setSortedBy(columnName);
  }
  function handleAssignStudentIdClick(userId, fullName, avatar, studentId) {
    setActionUserId(userId);
    setActionUserFullName(fullName);
    setActionUserAvatar(avatar);
    setActionStudentId(studentId ?? '');
    setIsOpenAssignStudentIdDialog(true);
  }
  function handleCloseAssignStudentIdDialog(userId, studentId) {
    setIsOpenAssignStudentIdDialog(false);
    if (isSuccess) {
      const updatedStudents = students.map(student => {
        return student['userId'] === userId ? {...student, studentId: studentId} : student;
      });
      setStudents(updatedStudents);
    }
    setIsSuccess(false);
  }
  function renderClassList(students) {
    return students.map((student) => (
      <StudentItem
        student={student}
        onAssignStudentIdClick={() => handleAssignStudentIdClick(student.userId, student.fullName, student.avatar, student.studentId)}
      />
    ));
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

  useEffect(() => {
    const fetchData = async (searchTerm) => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching students data:', Error);
          navigate('/admin-signin');
        }
        setAuthToken(token);
        let url = `/admin/management/class/student?classId=${classId}`;
        let query = '';
        if (searchTerm !== '') {
          query = query + `&&searchTerm=${searchTerm}`;
        }
        url = url + query;
        const response = await api.get(url);
        console.log('response.data: ', response.data);
        setStudents(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    fetchData(searchTerm);
  }, [isSearchClick]);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '55em' }}>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1.5 }}>
        <SearchBar
          placeholder="Search Student ID, Name"
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchChange}
          isButtonSearchEnabled={isSearchEnabled}
          onSearchClick={handleSearchClick}
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
                : students.length > 0
                  ? renderClassList(students) : <NoResultsFoundItem colSpan={titleNames.length} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <AssignStudentIdDialog
        userId={actionUserId} fullName={actionUserFullName} avatar={actionUserAvatar} _studentId={actionStudentId}
        isOpenAssignStudentIdDialog={isOpenAssignStudentIdDialog}
        onCloseAssignStudentIdDialog={handleCloseAssignStudentIdDialog}
        setIsSuccess={setIsSuccess}
      />
    </Container>
  );
}