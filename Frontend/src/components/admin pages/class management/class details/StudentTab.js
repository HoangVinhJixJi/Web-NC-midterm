import React, {useEffect, useState} from 'react';
import RenderFunctions from '../../table functions/RenderFunctions';
import {useNavigate} from 'react-router-dom';
import api, {setAuthToken} from '../../../../api/api';
import {
  Button,
  Container,
  Grid,
  ListItemIcon,
  Stack,
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
import AssignStudentIdDialog from '../dialogs/AssignStudentIdDialog';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignStudentIdToAllDialog from '../dialogs/AssignStudentIdToAllDialog';

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
  const [actionClassId, setActionClassId] = useState('');
  const [isOpenAssignStudentIdDialog, setIsOpenAssignStudentIdDialog] = useState(false);
  const [isOpenAssignStudentIdToAllDialog, setIsOpenAssignStudentIdToAllDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSort(columnName) {
    if (sortedBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
    }
    setSortedBy(columnName);
  }
  function handleAssignStudentIdClick(userId, fullName, avatar, classId) {
    setActionUserId(userId);
    setActionUserFullName(fullName);
    setActionUserAvatar(avatar);
    setActionClassId(classId);
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
  function handleAssignStudentIdToAllClick() {
    setActionClassId(classId);
    setIsOpenAssignStudentIdToAllDialog(true);
  }
  function handleCloseAssignStudentIdToAllDialog(data) {
    setIsOpenAssignStudentIdToAllDialog(false);
    if (isSuccess) {
      const updatedStudents = students.map(student => {
        const correspondingUser = data.find(item => item.userId === student.userId);
        if (correspondingUser) {
          return { ...student, studentId: correspondingUser.studentId };
        }
        return student;
      });
      setStudents(updatedStudents);
    }
    setIsSuccess(false);
  }
  function renderClassList(students) {
    return students.map((student) => (
      <StudentItem
        student={student}
        onAssignStudentIdClick={() => handleAssignStudentIdClick(student.userId, student.fullName, student.avatar, classId)}
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
        <Button variant="contained" color="primary" onClick={handleAssignStudentIdToAllClick}>
          <Stack direction="row" alignItems="center">
            <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
              <AssignmentIcon />
            </ListItemIcon>
            Assign Student ID To All
          </Stack>
        </Button>
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
        userId={actionUserId} fullName={actionUserFullName} avatar={actionUserAvatar}
        classId={actionClassId}
        isOpenAssignStudentIdDialog={isOpenAssignStudentIdDialog}
        onCloseAssignStudentIdDialog={handleCloseAssignStudentIdDialog}
        setIsSuccess={setIsSuccess}
      />
      <AssignStudentIdToAllDialog
        classId={actionClassId}
        isOpenAssignStudentIdToAllDialog={isOpenAssignStudentIdToAllDialog}
        onCloseAssignStudentIdToAllDialog={handleCloseAssignStudentIdToAllDialog}
        setIsSuccess={setIsSuccess}
      />
    </Container>
  );
}