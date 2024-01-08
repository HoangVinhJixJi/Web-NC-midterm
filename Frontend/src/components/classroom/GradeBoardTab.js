
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  
  Typography, 
  List,
  Button,
  TextField,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Container,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadIcon from '@mui/icons-material/Upload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import api, {setAuthToken} from '../../api/api';
import {
  exportGradeBoardToXLSX,
  exportGradeBoardToCSV,
  uploadGradeBoard,
  exportGradeAssignmentToXLSX,
  exportGradeAssignmentToCSV, 
  gradeAssignmentTemplateXLSX,
  gradeAssignmentTemplateCSV,
  uploadGradeAssignment,
} from '../../excel/exportExcel';


//Tạo input upload file
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
//Gom nhóm các bảng tạo thành mảng data hiển thị bảng điểm
const createDataSample = (students, assignments, grades) => {
  // Tạo initialData từ dữ liệu cơ sở dữ liệu
  const initialData = students.map((student) => {
    const studentScores = grades.filter((score) => score.studentId === student.studentId);
    const studentAssignments = assignments.map((assignment) => {
      const score = studentScores.find((score) => score.assignmentId === assignment.assignmentId) || { score: null };
      return { 
        id: assignment.assignmentId, 
        name: assignment.assignmentName, 
        score: score.score || '', //Không có điểm cho bài tập này
        status: score.status || '',
      };
    });

    return {
      studentId: student.studentId,
      studentName: student.studentName,
      assignments: studentAssignments,
      total: [],
    };
  });
  console.log('initialData: ', initialData);
  return initialData;
}

//Lấy cột điểm của 1 bài tập
const getAssignmentGrade = (data, assignmentName) =>{
  // Tạo initialData từ dữ liệu cơ sở dữ liệu
  const assignmentGrade = [];
  data.forEach((row) => {
    console.log('grade row: ', row);
    const gradeRow = row.assignments.find((assign)=> assign.name === assignmentName);
    assignmentGrade.push({
      studentId: row.studentId,
      grade: gradeRow.score,
    });
  });
  return assignmentGrade;
}

const GradeBoardTab = ({classId, isTeaching}) => {
  //Data
  
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [total, setTotal] = useState([]);
  const [data, setData] = useState([]);
  const [curValue, setCurValue] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedScore, setSelectedScore] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  //Interface
  const [isLoading, setIsLoading] = useState(true);
  const [messageInputGrade, setMessageInputGrade] = useState('');
  const [itemOpenFileType, setItemOpenFileType]  = useState('');
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [assignmentMenuAnchorEl, setAssignmentMenuAnchorEl] = useState(null);
  const [scoreMenuAnchorEl, setScoreMenuAnchorEl] = useState(null);
  const [fileTypeMenuAnchorEl, setFileTypeMenuAnchorEl] = useState(null);

  const navigate = useNavigate();
  // Tính tổng điểm cho từng học sinh 
  const totalGradeData = (data) => {
    const totalData = data.map((row) => {
      let sum = 0;
      let validAssignments = 0;
      row.assignments.forEach((assign) => {
        console.log(assign.score);
        if (assign.score !== '' && assign.score !== null && !isNaN(assign.score)) {
          sum += parseFloat(assign.score);
          validAssignments++;
        }
      });
      const averageGrade = validAssignments !== 0 ? (sum / validAssignments).toFixed(2) : '';
      return {
        studentId: row.studentId,
        grade: averageGrade,
      };
    });
    return totalData;
  };

  
  // * Call API render Grade Board
  const getDataAPI= ()=>{
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token){
          console.error('Error fetching user data:', Error);
          navigate('/signin');
        }
        // Đặt token cho mọi yêu cầu
        setAuthToken(token);
        // Gọi API để lấy dữ liệu danh sách toàn bộ các Học sinh của lớp học
        const response = await api.get(`/enrollments/student/${classId}`);
        console.log('List Students Data: ', response.data);
        // kiểm tra thông tin học sinh
        const list = response.data.reduce((accumulator, obj) => {
          if (obj.memberInfo != null && obj.role === 'student') {
            obj.memberInfo['studentId'] = obj.studentId;
            accumulator.push(obj.memberInfo);
          }
          return accumulator;
        }, []);
        const dataStudents = list.map((student) => {
          return {
            studentName: student.fullName,
            userId: student._id,
            studentId: student.studentId,
          };
        });
        console.log("list student: ", dataStudents);
        return dataStudents;
        
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching user data:', error);
        
      }
    };
    const fetchAssignmentData = async () => {
      try {
        // Gọi API để lấy dữ liệu danh sách toàn bộ các bài tập của lớp học
        const response = await api.get(`/assignments/${classId}`);
        console.log('List Assignments Data: ', response.data);
        const dataAssignments = response.data.map((assignment) => {
          return {
            assignmentName: assignment.assignmentName,
            assignmentId: assignment._id,
          };
        });
        console.log("list Asignments : ", dataAssignments);
        return dataAssignments;
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching user data:', error);
        
      }
    };
    const fetchGradeData = async () => {
      try {
        // Gọi API để lấy dữ liệu danh sách toàn bộ các điểm số trong lớp học
        const response = await api.get(`/grades/class/${classId}`);
        //Lưu thông tin toàn bộ lớp học vào state
        console.log('List Assignments Data: ', response.data);
        const dataGrades = response.data.map((grade) => {
          return {
            scoreId: grade._id,
            assignmentId: grade.assignmentId,
            studentId: grade.studentId,
            score: grade.score,
            status: grade.status,
          };
        });
        console.log("list Grades : ", dataGrades);
        return dataGrades;
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching user data:', error);
      }
    };
    const callGradeData = async () =>{
      // Gọi hàm lấy dữ liệu người dùng
      const StudentData = await fetchStudentData();
      const AssignmentData = await fetchAssignmentData();
      const GradeData = await fetchGradeData();
      setStudents(StudentData); //Lưu vào state : students
      setAssignments(AssignmentData); //Lưu vào state : assignments
      setGrades(GradeData); //Lưu vào state : grades
      setIsLoading(false);
      //Tạo mảng data để hiện thị Grade Board
      const dataSample = createDataSample(StudentData,AssignmentData, GradeData );
      console.log('1. => data Merge : ', dataSample);
      const totalData = totalGradeData(dataSample);
      
      console.log('totalData: ', totalData);
      setTotal(totalData);
      setData(dataSample);
    }
    callGradeData();
  }
  useEffect(() => {
    getDataAPI();
  }, []); 


  /*===================  Xử lý hiển thị giao diện ======================*/ 
  
  //Đóng thông báo lỗi input cell
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  //Lưu curValue điểm số hiện tại
  const handleCellValueClick = (value) => {
    setSelectedScore(value);
    setCurValue(value);
  }
  
  const changeCellGrade = (value, studentId, assignmentName) =>{
    
    const updatedData = data.map((row) => {
      if (row.studentId === studentId) {
        const updatedAssignments = row.assignments.map((assignment) => {
          if (assignment.name === assignmentName) {
            return {
              ...assignment,
              score: value,
            };
          }
          return assignment;
        });
        return {
          ...row,
          assignments: updatedAssignments,
        };
      }
      return row;
    });
    setData(updatedData);
    setSelectedScore(value);
  }
  const handleCellValueChange = (event, studentId, assignmentName) => {
    const value = event.target.value;
    changeCellGrade(value, studentId, assignmentName);
  };

  // Các menu 
  const handleAssignmentMenuOpen = (event, assignment) => {
    setAssignmentMenuAnchorEl(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleScoreMenuOpen = (event, assignmentName, row) => {
    const gradeObj = row.assignments.find((assign) => assign.name === assignmentName);
    setSelectedStudent(row.studentId);
    setIsPublic(gradeObj.status === 'public');
    setSelectedAssignment(assignmentName);
    setScoreMenuAnchorEl(event.currentTarget);
    setSelectedScore(gradeObj.score);
    
  };

  const handleMenuClose = () => {
    setAssignmentMenuAnchorEl(null);
    setScoreMenuAnchorEl(null);
    setFileTypeMenuAnchorEl(null);
    setSelectedAssignment(null);
    setSelectedScore(null);
  };

  const handleMenuFileClose = () => {
    setFileTypeMenuAnchorEl(null);
  };

  const handleFileTypeClick = (event) => {
    setItemOpenFileType(event.currentTarget.innerText);
    setFileTypeMenuAnchorEl(event.currentTarget);
  };


  /*===================  Xử lý File Upload/Download ======================*/ 

  //Upload file grade_board
  const handleUploadFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    try {
      const sheetData = await uploadGradeBoard(selectedFile);
      console.log("sheetData: ", sheetData);
      setData(sheetData);
      setIsUploadFile(true);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  };


  /*===================  Xử lý Quản lý điểm số ======================*/ 

  const isValidGrade = (grade) =>{
    if(grade===''){
      return true;
    }
    const numericValue = parseInt(grade);
    console.log('numericValue: ', numericValue);
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(grade) && parseInt(grade, 10) >= 0 && parseInt(grade, 10) <= 100;
  }
  //Lưu điểm số sau khi nhập vào ô input
  const handleSaveGradeChanges = (studentId, assignmentName) => {
    console.log('selectedScore: ', selectedScore);
    //Nếu như input rỗng hoặc trong quá trình upload dữ liệu thì không lưu vào database
    if(!isValidGrade(selectedScore) || isUploadFile ){
      let message = '';
      if (!isValidGrade(selectedScore)) {
        message = 'Invalid Grade!!!';
      } else {
        message = 'Cannot save the Grade while uploading!!!';
      }
      setSnackbarOpen(true);
      setMessageInputGrade(message);
      changeCellGrade(curValue, studentId, assignmentName);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
     
    }
    else if(selectedScore !== curValue )
    {
      if(selectedScore === ''){ //Điểm số rỗng tức là xóa điểm số của bài tập 
        const deleteGrade = async (gradeData) => {
          try {
            const response = await api.post(`/grades/delete`, gradeData);
            return response.data;
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
        const deleted = deleteGrade({
          classId, 
          assignmentId: assignments.find((a)=>{return a.assignmentName === assignmentName} ).assignmentId,
          studentId,
        })
        console.log('deleted: ', deleted);
        setSnackbarOpen(true);
        setMessageInputGrade('Grade is updated successfully!!!');
        setTimeout(() => {
          setSnackbarOpen(false);
        }, 3000);
      }
      else{
        //Tiến hành cập nhật lại giá trị điểm cho học sinh
        const gradeData = {
          classId: classId,
          assignmentId: assignments.find((a)=>{return a.assignmentName === assignmentName} ).assignmentId,
          studentId: studentId,
          score: parseInt(selectedScore),
          status: 'unlisted', //cho dù trước đó là 'public' cũng đặt lại 'unlisted'
        }
        console.log(gradeData);
        const sendGradeData = async (gradeData) => {
          try {
            //Lưu điểm số
            const response = await api.post(`/grades/create`, gradeData);
            setMessageInputGrade('Grade is updated successfully!!!');
            
            //Lưu thông tin toàn bộ lớp học vào state
            return response.data;
          } catch (error) {
            // Xử lý lỗi
            console.error('Error fetching user data:', error);
            setMessageInputGrade('### Error when update Grade ###');
            // Nếu lỗi là do xác thực (ví dụ: token hết hạn), chuyển hướng về trang đăng nhập
            if (error.response && error.response.status === 401) {
              navigate('/signin');
            }
            return null;
          }
        };
        const updated = sendGradeData(gradeData);
        console.log("update grade after fetch;  = ", updated);
        
        setSnackbarOpen(true);
        getDataAPI();
        const totalData = totalGradeData(data);
        setTotal(totalData);
        setTimeout(() => {
          setSnackbarOpen(false);
        }, 3000);
      }
    }

    
  };
  //Xử lý trả bài: thay đổi status điểm
  const handlePublicGrade = async () =>{
    handleMenuClose();
    const gradeData = {
      classId: classId,
      assignmentId: assignments.find((a)=>{return a.assignmentName === selectedAssignment} ).assignmentId,
      studentId: selectedStudent,
      score: parseInt(selectedScore),
      status: 'public',
    }
    console.log('gradeData update status: ', gradeData);
    const sendData = async (gradeData) => {
      try {
        const response = await api.post(`/grades/change-status`, gradeData);
        return response.data;
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching user data:', error);
      }
    };
    const updated = await sendData(gradeData);
    console.log('updated: ', updated);
    getDataAPI();
  }  
  //Xử lý trả bài cho toàn bộ học sinh
  const handlePublicAssignmentGrade = async () =>{
    handleMenuClose();
    const assignmentData = {
      classId: classId,
      assignmentId: assignments.find((a)=>{return a.assignmentName === selectedAssignment} ).assignmentId,
    }
    console.log('assignmentData update status: ', assignmentData);
    const sendData = async (data) => {
      try {
        const response = await api.post(`/grades/assignment/change-status`, data);
        console.log('response.data: ', response.data);
        return response.data;
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching user data:', error);
      }
    };
    const updated = await sendData(assignmentData);
    console.log('updated: ', updated);
    getDataAPI();
  }  
  //Thử thao tác tạo NOtification
  const handlePublicTestNoti = async () => {
    handleMenuClose();

    const notiData = {
      receiveId: students.find((stu)=> stu.studentId === selectedStudent).userId,
      message: 'Thông báo đây là 1 thông báo để thông báo có thông báo',
      type: 'public_grade',
      status: 'unread',
    }
    console.log('notidata : ', notiData);
    
    const sendData = async (notiData) => {
      try {
        const response = await api.post(`/notifications/send`, notiData);
        return response.data;
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching user data:', error);
      }
    };
    const updated = await sendData(notiData);
    console.log('updated: ', updated);
  } 

  
  // Xử lý Download file
  const handleFileTypeSelect = (fileType) => {
    console.log('itemOpenFileType: ', itemOpenFileType , ' - filetype: ', fileType);
    if(itemOpenFileType === 'DOWNLOAD GRADE BOARD' && fileType === 'XLSX'){
      exportGradeBoardToXLSX(data);
    }
    if(itemOpenFileType === 'DOWNLOAD GRADE BOARD' && fileType === 'CSV'){
      
      exportGradeBoardToCSV(data);
    }
    if(itemOpenFileType === 'Download Assignment' && fileType === 'XLSX'){
      console.log('XLSX select ass : ', selectedAssignment);
      exportGradeAssignmentToXLSX(data, selectedAssignment);
    }
    if(itemOpenFileType === 'Download Assignment' && fileType === 'CSV'){
      console.log('CSV select ass : ', selectedAssignment);
      exportGradeAssignmentToCSV(data, selectedAssignment);
    }
    if(itemOpenFileType === 'Download Template' && fileType === 'XLSX'){
      console.log('XLSX select ass : ', selectedAssignment);
      gradeAssignmentTemplateXLSX( selectedAssignment);
    }
    if(itemOpenFileType === 'Download Template' && fileType === 'CSV'){
      console.log('CSV select ass : ', selectedAssignment);
      gradeAssignmentTemplateCSV( selectedAssignment);
    }
    // Thực hiện logic tải xuống với fileType
    console.log(`Download assignment as ${fileType}`);
    handleMenuFileClose();
    setAssignmentMenuAnchorEl(null);
  };
  //Upload file điểm số bài tập
  const handleUploadAssignmentClick = async (e) => {
    const selectedFile = e.target.files[0];
    try {
      const assignmentGrades = await uploadGradeAssignment(selectedFile);
      console.log("assignment - Grades: ", assignmentGrades);
      const testdata = data;
      testdata.forEach((row) => {
        assignmentGrades.forEach(assignmentGrade => {
          if(assignmentGrade.studentId !== '' && row.studentId === assignmentGrade.studentId ){
            row.assignments.forEach((assign, index)=>{
              if(assign.name === selectedAssignment){
                row.assignments[index].score = parseInt(assignmentGrade.grade);
              }
            })
          } 
        })
      })
      setData(testdata);
      setIsUploadFile(true);
      setAssignmentMenuAnchorEl(null);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  };
  //Xác nhận lưu data từ file vào database hay không?
  const handleSaveUploadFile = () => {
    const detailAssigment = assignments.find((row)=>
      row.assignmentName === selectedAssignment
    );
    const gradeList = getAssignmentGrade(data, selectedAssignment);
    const gradeData ={
      classId,
      assignmentId: detailAssigment.assignmentId,
      list: gradeList,
    }
    console.log('Save data from file upload to database: ',gradeData);
    const sendGradeAssignmentData = async (gradeData) => {
      try {
        const response = await api.post(`/grades/create/assignment`, gradeData);
        return response.data;
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching user data:', error);
      }
    };
    sendGradeAssignmentData(gradeData);
    setIsUploadFile(false);
    getDataAPI();
  }
  //Danh sách tên các bài tập 
  const assignmentNames = assignments.map((assignment) => assignment.assignmentName);
  console.log('============ data ========= ', data);
  return (
    <>
    { students && isLoading ? 
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
      :
    <div>
    {/* { ===== Button download và save  Grade board ========} */}
    <Container>
      <List>
        <Button component="label" disabled variant="contained" color="primary" startIcon={<UploadIcon />} sx={{margin: '8px'}}>
          Upload Grade Board
          <VisuallyHiddenInput type="file" onChange={handleUploadFileChange}/>
        </Button>
        {isUploadFile && 
          <Button variant="contained" color='error' startIcon={<SaveAltIcon />} onClick={handleSaveUploadFile}>
              Save Data
          </Button>
        }
      </List>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={handleFileTypeClick}
        sx={{margin: '8px'}}
      >
        Download Grade Board
      </Button>
    </Container>
    {/* { ===== Header của Grade board ========} */}
    <TableContainer component={Paper} sx={{ overflowY: 'auto' , maxHeight: 'calc(100vh - 200px)' ,overflowX: 'auto', maxWidth: 'calc(100vw - 200px)'}}>
    <Table style={{ tableLayout: 'fixed', border: '1px solid #ddd'}}>
      <TableHead >
        <TableRow>
          <TableCell style={{ width: '150px' , borderRight: '1px solid #ddd' }}> Student ID </TableCell>
          <TableCell style={{ width: '150px' , borderRight: '1px solid #ddd' }}> Student Name </TableCell>
          {assignmentNames.map((assignmentName, index) => (
            <TableCell key={assignmentName} align="right" style={{ width: '150px', borderRight: '1px solid #ddd'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography
                  gutterBottom
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    WebkitLineClamp: 2,
                    paddingRight: '8px',
                  }}
                >
                  {assignmentName}
                </Typography>
                <IconButton
                  aria-controls="assignment-menu"
                  aria-haspopup="true"
                  onClick={(event) => handleAssignmentMenuOpen(event, assignmentName)}
                >
                  <MoreVertIcon />
                </IconButton>
              </div>
            </TableCell>
          ))}
          <TableCell style={{ width: '150px' , borderRight: '1px solid #ddd' }}>
            Total Grade
            <IconButton
                  aria-controls="assignment-menu"
                  aria-haspopup="true"
                  onClick={(event) => handleAssignmentMenuOpen(event, '')}
                >
                  <MoreVertIcon />
                </IconButton>
          </TableCell>
        </TableRow>
      </TableHead>

      {/* { ======= Body của Grade board ========} */}
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={row.studentId}>
          <TableCell component="th" scope="row"  style={{ width: '150px' , borderRight: '1px solid #ddd', textDecoration: 'nowrap' }} >
          <Stack  sx={{ minWidth: 0 }} >
            <Tooltip title={row.studentId}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Typography noWrap >{row.studentId}</Typography>
                </div>
            </Tooltip>
          </Stack>
            </TableCell>
            <TableCell component="th" scope="row"  style={{ width: '150px' , borderRight: '1px solid #ddd' }}>
              {row.studentName} 
            </TableCell>
            {assignmentNames.map((assignmentName) => {
              
              const gradeObj = row.assignments.find((assign) => assign.name === assignmentName);
              return (
              <TableCell key={assignmentName} align="right" style={{  width: '150px', borderRight:  '1px solid #ddd'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                  <TextField
                    value={gradeObj?.score || ''}
                    onClick={() => handleCellValueClick(gradeObj?.score || '')}
                    onChange={(e) => handleCellValueChange(e, row.studentId, assignmentName)}
                    onBlur={() => handleSaveGradeChanges(row.studentId, assignmentName)}
                    InputProps={{
                      style: {
                        color: gradeObj?.status === 'public' ? 'black' : 'red',
                      },
                    }}
                  />
                  </span>
                  <IconButton
                    aria-controls="score-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleScoreMenuOpen(event, assignmentName, row )}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </TableCell>
            )})}
            {/* { ===== Cột tổng điểm Total grade ========} */}
            {total.map((totalGrade, totalIndex) => {

              if (totalGrade.studentId === row.studentId) {
                return (
                  <TableCell key={totalIndex} align="right" style={{ width: '150px', borderRight: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        <TextField
                          value={totalGrade.grade !== '' ? totalGrade.grade : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </span>
                      <IconButton
                        aria-controls="score-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleScoreMenuOpen(event, '')}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                );
              }
              return null;
            })}
            
            
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {/* { ===== Menu click vào Assignment========} */}
    <Menu
      id="assignment-menu"
      anchorEl={assignmentMenuAnchorEl}
      keepMounted
      open={Boolean(assignmentMenuAnchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Chỉnh sửa</MenuItem>
      <MenuItem onClick={handleMenuClose}>Xóa</MenuItem>
      <MenuItem onClick={handlePublicAssignmentGrade}>Trả bài tất cả</MenuItem>
      <MenuItem onClick={handleFileTypeClick}>Download Assignment</MenuItem>
      <MenuItem onClick={handleFileTypeClick}>Download Template</MenuItem>
      
      <label htmlFor="upload-input">
        <MenuItem>
          Upload Grade
        </MenuItem>
      </label>
      <VisuallyHiddenInput
        id="upload-input"
        type="file"
        onChange={handleUploadAssignmentClick}
      />
    </Menu>
    {/* { ===== Menu File type ========} */}
    <Menu
      id="filetype-menu"
      open={Boolean(fileTypeMenuAnchorEl)}
      anchorEl={fileTypeMenuAnchorEl}
      keepMounted
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <MenuItem onClick={() => handleFileTypeSelect('CSV')}>.CSV</MenuItem>
      <MenuItem onClick={() => handleFileTypeSelect('XLSX')}>.XLSX</MenuItem>
    </Menu>
    {/* { ===== Menu click vào ô điểm số ========} */}
    <Menu
      id="score-menu"
      anchorEl={scoreMenuAnchorEl}
      keepMounted
      open={Boolean(scoreMenuAnchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem disabled={isPublic}  onClick={handlePublicGrade}>Trả bài</MenuItem>
      <MenuItem onClick={handlePublicTestNoti}>Thao tác với điểm</MenuItem>
    </Menu>
    {/* { ===== Thông báo lỗi input ========} */}
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={isSnackbarOpen}
      message={messageInputGrade}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
    </TableContainer>
  </div>}
  </>
  );
    
};

export default GradeBoardTab