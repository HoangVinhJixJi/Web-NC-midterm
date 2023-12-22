
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  Divider,
  Button, 
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Grid,
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
  ListItemButton,
  ListItemIcon,
  Collapse,
  Popover
} from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from '@mui/icons-material/Add';
import api, {setAuthToken} from '../../api/api';
import {exportToExcel, exportToCSV, readExcelFile} from '../../excel/exportExcel';
const createDataSample = () =>{
  // Giả sử bạn có các dữ liệu từ cơ sở dữ liệu
  const students = [
    { studentId: 1, studentName: 'studentName 1' },
    { studentId: 2, studentName: 'studentName 2' },
    { studentId: 3, studentName: 'studentName 3' },
    { studentId: 4, studentName: 'Nguyễn Hoàng Vinh' },
    { studentId: 5, studentName: 'Trần Đình Nam' },
    { studentId: 6, studentName: 'studentName 6' },
    { studentId: 7, studentName: 'Hà XUân Trường' },
    { studentId: 8, studentName: 'studentName 8' },
    
  ];
  const assignments = [
    { assignmentId: 1, assignmentName: 'Assignment 1' },
    { assignmentId: 2, assignmentName: 'Bài tập điểm cộng' },
    { assignmentId: 3, assignmentName: 'Assignment 3' },
    { assignmentId: 4, assignmentName: 'Bài tập giữa kỳ' },
    { assignmentId: 5, assignmentName: 'Assignment 5' },
  ];
  const scores = [
    { scoreId: 1, assignmentId: 1, studentId: 1, score: 90 },
    { scoreId: 2, assignmentId: 1, studentId: 2, score: 10 },
    { scoreId: 3, assignmentId: 1, studentId: 3, score: 20 },
    { scoreId: 4, assignmentId: 1, studentId: 4, score: 85 },
    { scoreId: 5, assignmentId: 1, studentId: 5, score: 90 },
    { scoreId: 6, assignmentId: 1, studentId: 6, score: 10 },
    { scoreId: 7, assignmentId: 1, studentId: 7, score: 20 },
    { scoreId: 8, assignmentId: 1, studentId: 8, score: 85 },
    { scoreId: 1, assignmentId: 3, studentId: 1, score: 90 },
    { scoreId: 2, assignmentId: 3, studentId: 2, score: 10 },
    { scoreId: 3, assignmentId: 3, studentId: 3, score: 20 },
    { scoreId: 4, assignmentId: 3, studentId: 4, score: 85 },
    { scoreId: 5, assignmentId: 3, studentId: 5, score: 90 },
    { scoreId: 6, assignmentId: 3, studentId: 6, score: 10 },
    { scoreId: 7, assignmentId: 3, studentId: 7, score: 20 },
    { scoreId: 8, assignmentId: 3, studentId: 8, score: 85 },
  ];
// Tạo initialData từ dữ liệu cơ sở dữ liệu
const initialData = students.map((student) => {
  const studentScores = scores.filter((score) => score.studentId === student.studentId);
  const studentAssignments = assignments.map((assignment) => {
    const score = studentScores.find((score) => score.assignmentId === assignment.assignmentId) || { score: null };
    return { assignmentId: assignment.assignmentId, assignmentName: assignment.assignmentName, score: score.score };
  });

  return {
    studentName: student.studentName,
    assignments: studentAssignments.reduce((acc, assignment) => {
      acc[assignment.assignmentName] = assignment.score;
      return acc;
    }, {}),
  };
});
  return initialData;
}

const GradeBoardTab = ({classId, isTeaching}) => {
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cellValue, setCellValue] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Lấy token từ localStorage hoặc nơi lưu trữ khác
        const token = localStorage.getItem('token');
        if(!token){
          console.error('Error fetching user data:', Error);
          navigate('/signin');
        }
        
        // Đặt token cho mọi yêu cầu
        setAuthToken(token);
        // Gọi API để lấy dữ liệu danh sách toàn bộ các học sinh của lớp học
        const response = await api.get(`/enrollments/student/${classId}`);
        //Lưu thông tin toàn bộ lớp học vào state
        console.log('List Students Data: ', response.data);
        //Kiểm tra lại thông tin student:
        const list = response.data.reduce((accumulator, obj) => {
          if (obj.memberInfo != null && obj.role === 'student') {
            accumulator.push(obj.memberInfo);
          }
          return accumulator;
        }, []);
        
        console.log("list: ", list);
        setStudents(list);
        setIsLoading(false);
        
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching user data:', error);
        // Nếu lỗi là do xác thực (ví dụ: token hết hạn), chuyển hướng về trang đăng nhập
        if (error.response && error.response.status === 401) {
          navigate('/signin');
        }
      }
    };

    // Gọi hàm lấy dữ liệu người dùng
    fetchStudentData();

  }, []); 
  const handleAddStudentClick = () => {
    setIsAddStudentDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddStudentDialogOpen(false);
    setNewStudentEmail('');
    setMessage('');
  };

  const handleAddStudentConfirm = async() => {
    // Kiểm tra hợp lệ của địa chỉ email
    if (isValidEmail(newStudentEmail)) {
      const allEmails = await api.get(`/classes/email/${classId}`);
      const check = allEmails.data.includes(newStudentEmail);
      if (check) {
        setMessage('Email is already in the class!');
      }
      else {
        const u = await api.get('/auth/profile');
        const userData = {
          userEmail: u.data.email,
          invitedEmail: newStudentEmail,
          role: "student",
        }
        console.log(userData);
        const res = await api.post(`/classes/invite-email/${classId}`, userData);
        console.log(res);
        setInvitedEmails((prevInvitedEmails) => [...prevInvitedEmails, { email: newStudentEmail, invited: true }]);
        setMessage('Invitation sent successfully!');
      }
    } else {
      // Hiển thị thông báo lỗi hoặc thực hiện hành động phù hợp
      setMessage('Email is not valid!');
    }
  };
  const isValidEmail = (email) => {
    // Sử dụng biểu thức chính quy đơn giản để kiểm tra hợp lệ của địa chỉ email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleExportExcel = (data) => {
    exportToExcel(data);
  };
  const handleExportCSV = (data) => {
    exportToCSV(data);
  };
 //Upload file xslx 
 // Dữ liệu giả định về danh sách học sinh và bảng điểm
 const sampleStudents = [
  { id: 1, name: 'Student 1' },
  { id: 2, name: 'Student 2' },
  { id: 3, name: 'Student 3' },
  { id: 4, name: 'Student 4' },
  { id: 5, name: 'Student 5' },
  { id: 6, name: 'Student 6' },
  { id: 7, name: 'Student 7' },
  { id: 8, name: 'Student 8' },
  { id: 9, name: 'Student 9' },
  { id: 10, name: 'Student 10' },
  { id: 11, name: 'Student 11' },
  { id: 12, name: 'Student 12' },
  { id: 13, name: 'Student 13' },
  { id: 14, name: 'Student 14' },
  { id: 15, name: 'Student 15' },
  { id: 16, name: 'Student 16' },
  { id: 17, name: 'Student 17' },
  { id: 18, name: 'Student 18' },
  { id: 19, name: 'Student 19' },
  { id: 20, name: 'Student 20' },
  // Thêm dữ liệu học sinh khác nếu cần
];
const assignments = [
  { id: 1, assignmentName: 'Assignment 1' },
  { id: 2, assignmentName: 'Assignment 2' },
  { id: 3, assignmentName: 'Assignment 3' },
  { id: 4, assignmentName: 'Assignment 4' },
  { id: 5, assignmentName: 'Assignment 5' },
  { id: 6, assignmentName: 'Assignment 6' },
  // Thêm dữ liệu bài tập khác nếu cần
];
// Dữ liệu điểm của từng học sinh cho từng bài tập
const grades = [
  { studentId: 1, assignmentId: 1, score: 90 },
  { studentId: 1, assignmentId: 2, score: 85 },
  { studentId: 1, assignmentId: 3, score: 92 },
  { studentId: 2, assignmentId: 1, score: 90 },
  { studentId: 2, assignmentId: 2, score: 85 },
  { studentId: 2, assignmentId: 3, score: 92 },
  { studentId: 3, assignmentId: 1, score: 90 },
  { studentId: 4, assignmentId: 2, score: 85 },
  { studentId: 5, assignmentId: 3, score: 92 },
  { studentId: 6, assignmentId: 1, score: 90 },
  { studentId: 7, assignmentId: 2, score: 85 },
  { studentId: 8, assignmentId: 3, score: 92 },
  { studentId: 9, assignmentId: 1, score: 90 },
  { studentId: 10, assignmentId: 2, score: 85 },
  { studentId: 12, assignmentId: 3, score: 92 },
  { studentId: 5, assignmentId: 2, score: 92 },
  { studentId: 6, assignmentId: 2, score: 90 },
  { studentId: 7, assignmentId: 3, score: 85 },
  { studentId: 8, assignmentId: 1, score: 92 },
  { studentId: 9, assignmentId: 2, score: 90 },
  { studentId: 10, assignmentId: 3, score: 85 },
  { studentId: 12, assignmentId: 1, score: 77 },
  { studentId: 13, assignmentId: 1, score: 47 },
  { studentId: 14, assignmentId: 1, score: 96 },
  { studentId: 15, assignmentId: 1, score: 56 },
  { studentId: 16, assignmentId: 1, score: 14 },
  { studentId: 17, assignmentId: 1, score: 90 },
  { studentId: 18, assignmentId: 1, score: 62 },
  { studentId: 19, assignmentId: 1, score: 52 },
  { studentId: 12, assignmentId: 2, score: 77 },
  { studentId: 13, assignmentId: 2, score: 47 },
  { studentId: 14, assignmentId: 2, score: 96 },
  { studentId: 15, assignmentId: 2, score: 56 },
  { studentId: 16, assignmentId: 2, score: 14 },
  { studentId: 17, assignmentId: 2, score: 90 },
  { studentId: 18, assignmentId: 2, score: 62 },
  { studentId: 19, assignmentId: 2, score: 52 },
  // Thêm dữ liệu điểm khác nếu cần
];

// const initialData = [
//   { studentName: 'Student 1', assignments: { assignment1: 90, assignment2: 10 } },
//   { studentName: 'Student 2', assignments: { assignment1: 20, assignment2: 85 } },
//   { studentName: 'Student 3', assignments: { assignment1: 75, assignment2: 30 } },
//   { studentName: 'Student 4', assignments: { assignment1: 40, assignment2: 60 } },
//   { studentName: 'Student 5', assignments: { assignment1: 85, assignment2: 45 } },
//   { studentName: 'Student 6', assignments: { assignment1: 60, assignment2: 75 } },
//   { studentName: 'Student 7', assignments: { assignment1: 25, assignment2: 95 } },
//   { studentName: 'Student 8', assignments: { assignment1: 70, assignment2: 20 } },
//   { studentName: 'Student 9', assignments: { assignment1: 55, assignment2: 50 } },
//   { studentName: 'Student 10', assignments: { assignment1: 80, assignment2: 65 } },
//   { studentName: 'Student 11', assignments: { assignment1: 30, assignment2: 40 } },
//   { studentName: 'Student 12', assignments: { assignment1: 65, assignment2: 85 } },
//   { studentName: 'Student 13', assignments: { assignment1: 90, assignment2: 15 } },
//   { studentName: 'Student 14', assignments: { assignment1: 45, assignment2: 75 } },
//   { studentName: 'Student 15', assignments: { assignment1: 70, assignment2: 35 } },
//   { studentName: 'Student 16', assignments: { assignment1: 35, assignment2: 55 } },
//   { studentName: 'Student 17', assignments: { assignment1: 80, assignment2: 95 } },
//   { studentName: 'Student 18', assignments: { assignment1: 55, assignment2: 25 } },
//   { studentName: 'Student 19', assignments: { assignment1: 40, assignment2: 50 } },
//   { studentName: 'Student 20', assignments: { assignment1: 75, assignment2: 70 } },
//   { studentName: 'Student 21', assignments: { assignment1: 20, assignment2: 60 } },
//   { studentName: 'Student 22', assignments: { assignment1: 65, assignment2: 35 } },
//   { studentName: 'Student 23', assignments: { assignment1: 90, assignment2: 25 } },
//   { studentName: 'Student 24', assignments: { assignment1: 55, assignment2: 85 } },
//   { studentName: 'Student 25', assignments: { assignment1: 30, assignment2: 45 } },
//   { studentName: 'Student 26', assignments: { assignment1: 75, assignment2: 40 } },
//   { studentName: 'Student 27', assignments: { assignment1: 50, assignment2: 70 } },
//   { studentName: 'Student 28', assignments: { assignment1: 85, assignment2: 20 } },
//   { studentName: 'Student 29', assignments: { assignment1: 40, assignment2: 50 } },
//   { studentName: 'Student 30', assignments: { assignment1: 65, assignment2: 80 } },
//   // ... add more data
// ];

  const sampleData = createDataSample();
  // grades.forEach((s)=>{
  //   const obj = {};
  //   obj['name'] = sampleStudents[s.studentId -1].name;
  //   if(s.assignmentId === 1){
  //       obj['assignment1'] = s.score;
  //   }
  //   if(s.assignmentId === 2){
  //       obj['assignment2'] = s.score;
  //   }
  //   sampleData.push(obj);
  // })
  // console.log('data: = ', sampleData);

//  const data  = [
//     {
//         "studentName": "studentName 2",
//         "assignments": {
//             "Assignment 1": 10,
//             "Bài tập điểm cộng": null,
//             "Assignment 3": 10,
//             "Bài tập giữa kỳ": null,
//             "Assignment 5": null
//         }
//     },
//     {
//         "studentName": "studentName 3",
//         "assignments": {
//             "Assignment 1": 20,
//             "Bài tập điểm cộng": null,
//             "Assignment 3": 20,
//             "Bài tập giữa kỳ": null,
//             "Assignment 5": null
//         }
//     },
//     {
//         "studentName": "Nguyễn Hoàng Vinh",
//         "assignments": {
//             "Assignment 1": 85,
//             "Bài tập điểm cộng": null,
//             "Assignment 3": 85,
//             "Bài tập giữa kỳ": null,
//             "Assignment 5": null
//         }
//     },
//     {
//         "studentName": "studentName 8",
//         "assignments": {
//             "Assignment 1": 85,
//             "Bài tập điểm cộng": null,
//             "Assignment 3": 85,
//             "Bài tập giữa kỳ": null,
//             "Assignment 5": null
//         }
//     }
// ]
  const [file, setFile] = useState(null);
  const [data, setData] = useState(sampleData);
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    try {
      const sheetData = await readExcelFile(selectedFile);
      console.log("sheetData: ", sheetData);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  };

  const handleCellValueChange = (event, studentName, assignmentName) => {
    const updatedData = data.map((row) => {
      if (row.studentName === studentName) {
        return {
          ...row,
          assignments: {
            ...row.assignments,
            [assignmentName]: event.target.value,
          },
        };
      }
      return row;
    });
    setData(updatedData);
  };
  //const columns = data.length > 0 ? Object.keys(data[0]).map((header) => ({ Header: header, accessor: header })) : [];
  
  
  
  const assignmentNames = data.length > 0 ? Object.keys(data[0].assignments) : [];
  const [assignmentMenuAnchorEl, setAssignmentMenuAnchorEl] = useState(null);
  const [scoreMenuAnchorEl, setScoreMenuAnchorEl] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedScore, setSelectedScore] = useState(null);
  const [openMenuDownLoad, setOpenMenuDownLoad] = useState(false);
  const [itemOpenTypeFile, setItemOpenTypeFile]  = useState('');

  const handleClickMenuDownload = () => {
    setOpenMenuDownLoad(!openMenuDownLoad);
  };
  const handleDownloadGradeBoard = () =>{

  }

  const handleAssignmentMenuOpen = (event, assignment) => {
    setAssignmentMenuAnchorEl(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleScoreMenuOpen = (event, score) => {
    setScoreMenuAnchorEl(event.currentTarget);
    setSelectedScore(score);
  };

  const handleMenuClose = () => {
    setAssignmentMenuAnchorEl(null);
    setScoreMenuAnchorEl(null);
    setSelectedAssignment(null);
    setSelectedScore(null);
  };

  const [editingState, setEditingState] = useState({});
  
  const handleSaveChanges = (studentName, assignmentName) => {
    //const updatedValue = assignments[assignmentName] !== undefined ? assignments[assignmentName] : '';
  };
  
  console.log(data);

  const [fileTypeMenuAnchorEl, setFileTypeMenuAnchorEl] = useState(null);

  const handleMenuFileClose = () => {
    setFileTypeMenuAnchorEl(null);
  };

  const handleTypeFileClick = (event) => {
    console.log("event.currentTarget: ", event.currentTarget.innerText);
    setItemOpenTypeFile(event.currentTarget.innerText);
    setFileTypeMenuAnchorEl(event.currentTarget);
  };

  const handleFileTypeSelect = (fileType) => {
    console.log('itemOpenTypeFile: ', itemOpenTypeFile , ' - filetype: ', fileType);
    if(itemOpenTypeFile === 'DOWNLOAD GRADE BOARD' && fileType === 'XLSX'){
      exportToExcel(data);
    }
    if(itemOpenTypeFile === 'DOWNLOAD GRADE BOARD' && fileType === 'CSV'){
      exportToCSV(data);
    }
    // Thực hiện logic tải xuống với fileType
    console.log(`Download assignment as ${fileType}`);
    handleMenuFileClose();
    setAssignmentMenuAnchorEl(null);
  };
  //Kiểm tra nếu là giáo viên thì hiển thị Button Thêm học sinh còn nếu là học sinh thì chỉ cho xem số lượng học sinh
    return (
      <>
      { students && isLoading ? 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
        :
      <div>
      {/* <input type="file" onChange={handleFileChange} />
      
      <Button variant="outlined" color="primary" onClick={()=>handleExportExcel(data)}>
        Export Grade Board (XLSX)
      </Button>
      <Button variant="outlined" color="primary" onClick={()=>handleExportCSV(data)}>
        Export Grade Board (CSV)
      </Button> */}
      <div>
      {/* Download buttons */}
      <TextField 
        type='file'
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={handleTypeFileClick}
        sx={{margin: '16px'}}
      >
        Download Grade Board
      </Button>

      
    </div>

      <TableContainer component={Paper} sx={{ overflowY: 'auto' , maxHeight: 'calc(100vh - 200px)' ,overflowX: 'auto', maxWidth: 'calc(100vw - 200px)'}}>
      <Table style={{ tableLayout: 'fixed', border: '1px solid #ddd'}}>
        <TableHead >
          <TableRow>
            <TableCell style={{ width: '150px' , borderRight: '1px solid #ddd' }}>Student Name</TableCell>
            {assignmentNames.map((assignmentName, index) => (
              <TableCell key={assignmentName} align="right" style={{ width: '150px', borderRight: index !== assignmentNames.length - 1 ? '1px solid #ddd' : 'none' }}>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.studentName}>
              <TableCell component="th" scope="row"  style={{ width: '150px' , borderRight: '1px solid #ddd' }}>
                {row.studentName}
              </TableCell>
              {assignmentNames.map((assignmentName, index) => (
                <TableCell key={assignmentName} align="right" style={{  width: '150px', borderRight: index !== assignmentNames.length - 1 ? '1px solid #ddd' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                    <TextField
                      value={row.assignments[assignmentName] || ''}
                      onChange={(e) => handleCellValueChange(e, row.studentName, assignmentName)}
                      onBlur={() => handleSaveChanges(row.studentName, assignmentName)}
                    />
                      
                    </span>
                    
                    <IconButton
                      aria-controls="score-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleScoreMenuOpen(event, row.assignments[assignmentName])}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                </TableCell>
              ))}
              <TableCell>
                
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Menu
        id="assignment-menu"
        anchorEl={assignmentMenuAnchorEl}
        keepMounted
        open={Boolean(assignmentMenuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Chỉnh sửa</MenuItem>
        <MenuItem onClick={handleMenuClose}>Xóa</MenuItem>
        <MenuItem onClick={handleMenuClose}>Trả bài tất cả</MenuItem>
        <MenuItem onClick={handleTypeFileClick}>Download Grade</MenuItem>
        <MenuItem onClick={handleTypeFileClick}>Download Template</MenuItem>
        <MenuItem onClick={handleTypeFileClick}>Upload Grade</MenuItem>
      </Menu>
      <Menu
        open={Boolean(fileTypeMenuAnchorEl)}
        anchorEl={fileTypeMenuAnchorEl}
        onClose={handleMenuFileClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleFileTypeSelect('CSV')}>Download as CSV</MenuItem>
        <MenuItem onClick={() => handleFileTypeSelect('XLSX')}>Download as XLSX</MenuItem>
      </Menu>


      <Menu
        id="score-menu"
        anchorEl={scoreMenuAnchorEl}
        keepMounted
        open={Boolean(scoreMenuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Trả bài</MenuItem>
        <MenuItem onClick={handleMenuClose}>Thao tác với điểm</MenuItem>
      </Menu>
    </TableContainer>
      </div>}
      </>
    );
  };

export default GradeBoardTab