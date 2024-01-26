
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Menu,
  MenuItem
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import BlockIcon from '@mui/icons-material/Block';

import AddIcon from '@mui/icons-material/Add';
import api, {setAuthToken} from '../../api/api';
import { styled } from '@mui/material/styles';
import {
  exportStudentListToXLSX,
  exportStudentListToCSV,
  uploadStudentList,
} from '../../excel/exportExcel';
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
const StudentListTab = ({classId, isTeaching}) => {
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);
  const [students, setStudents] = useState([]);

  const [isCreator, setIsCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [fileTypeMenuAnchorEl, setFileTypeMenuAnchorEl] = useState(null);
  
  const navigate = useNavigate();
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
      //Kiểm tra lại thông tin học sinh:
      const list = response.data.reduce((accumulator, obj) => {
        if (obj.memberInfo != null && obj.role === 'student') {
          obj.memberInfo['studentId'] = obj.studentId;
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
  //fetch enrollment 
  const fetchEnrollment = async () => {
    try {
      // Lấy token từ localStorage hoặc nơi lưu trữ khác
      const token = localStorage.getItem('token');
      if(!token){
        console.error('Error fetching user data:', Error);
        
        navigate('/signin');
      }
      
      // Đặt token cho mọi yêu cầu
      setAuthToken(token);
      // Gọi API để lấy dữ liệu enrollment
      const response = await api.get(`/enrollments/get/one/${classId}`);
      //Lưu thông tin toàn bộ lớp học vào state
      console.log('get/ones Data: ', response.data);
      //Kiểm tra lại thông tin học sinh:
      if(response.data.isCreator){
        setIsCreator(response.data.isCreator);
      }
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
  useEffect(() => {
    // Gọi hàm lấy dữ liệu người dùng
    fetchStudentData();
    fetchEnrollment();

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
  const handleMenuFileClose = () => {
    setFileTypeMenuAnchorEl(null);
  };
  const handleFileTypeClick = (event) => {
    setFileTypeMenuAnchorEl(event.currentTarget);
  };
  const handleFileTypeSelect = (fileType) => {
    if( fileType === 'XLSX'){
      exportStudentListToXLSX(students);
    }
    if(fileType === 'CSV'){
      exportStudentListToCSV(students);
    }
    console.log(`Download student list  as ${fileType}`);
    handleMenuFileClose();
  };
  //Xử lý upload file danh sách học sinh


  const handleUploadFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    try {
      const sheetData = await uploadStudentList(selectedFile);
      console.log("sheetData: ", sheetData);
      const studentData = students;
      studentData.forEach((row) => {
        sheetData.forEach((fileData, index) => {
          console.log('fileData: ', fileData);
          if(fileData.fullName !== '' && row.email === fileData.email
           &&  row.studentId !== fileData.studentId){
            console.log('update');
            row.oldStudentId = row.studentId;
            row.studentId = fileData.studentId;
            
          } 
        })
      })
      console.log('==>>>>> studentData after upload == : ', studentData);
      //gọi fetch data
      setStudents(studentData);
      setIsUploadFile(true);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      alert(error.message);
    }
  };
 

  //Xác nhận lưu data từ file vào database hay không?
  const handleSaveUploadFile = () => {
    const sendStudentIdChangeEnrollment = async (studentData) => {
      try {
        const response = await api.post(`/users/teacher-update-studentId`, studentData);
        return response.data;
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching update data /users/teacher-update-studentId :', error);
      }
    };
    const sendStudentIdChangeGrade = async (studentData) => {
      try {
        const response = await api.post(`/grades/update/studentid`, studentData);
        return response.data;
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching update data grades/update/studentid:', error);
      }
    };
    const sendObj = {
      classId,
      list: students.filter((s) => s.oldStudentId).map((s) => (
        {
          userId: s._id,
          oldStudentId: s.oldStudentId,
          studentId: s.studentId,
        })),
    };
    const sendObjToUser = {
      classId,
      list: students.filter((s) => s.oldStudentId).map((s) => (
        {
          studentUserId: s._id,
          newStudentId: s.studentId,
        })),
    };
    const updatedEnroll = sendStudentIdChangeEnrollment(sendObjToUser);
    const updatedGrade = sendStudentIdChangeGrade(sendObj);
    setIsUploadFile(false);
  }
   //Hủy thao tác update student 
  const handleCancelUploadFile = ()=> {
    fetchStudentData();
    setIsUploadFile(false);
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
      <Grid container alignItems="center" justifyContent="space-between">
        
        <Typography variant="h6" gutterBottom>
          Student List
        </Typography>
        <Grid item >
          <Grid container alignItems="center" spacing={1}>
          {students && <Grid item>
            <Typography variant="body1">
            {!isTeaching
              ? students.length === 0
                  ? `${students.length +1} student`
                  : `${students.length+1} students`
                : students.length < 2 ?
                `${students.length } student `
                :`${students.length } students`}

            </Typography>
          </Grid>}
          { isTeaching &&
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddStudentClick}
            >
              Add
            </Button>
          </Grid>
          }
          </Grid>
          
        </Grid>
      </Grid>
      {isTeaching && 
        <>
        {isCreator && <Button component="label" variant="contained" startIcon={<UploadIcon />}>
          Upload Student List
          <VisuallyHiddenInput type="file" onChange={handleUploadFileChange}/>
        </Button>}
        <Button
          variant="contained"
          color="primary"
          sx={{margin: '16px'}}
          onClick={handleFileTypeClick}
          startIcon= {<DownloadIcon/>}
        >
          Download Student List
        </Button>
        </>
      
      }
      
      {isUploadFile && 
        <>
          <Button variant="contained" color='error' startIcon={<SaveAltIcon />} onClick={handleSaveUploadFile}>
              Save Data
          </Button>
          <Button variant="contained" sx={{backgroundColor: 'gray', margin: '8px'}} startIcon={<BlockIcon />} 
                  onClick={handleCancelUploadFile}>
              Cancel
          </Button>
          </>
        }
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
        <Divider sx={{ margin: '16px 0' }} />

        {invitedEmails.map((teacher) => (
          <ListItem key={teacher.email} sx={{ opacity: teacher.invited ? 0.5 : 1 }}>
            <ListItemText primary={teacher.email} secondary={teacher.invited ? 'Invitation sent' : ''} />
          </ListItem>
        ))}
        {students && <List>
          {students.map((student) => (
            <ListItem key={student._id}>
              <ListItemAvatar>
                <Avatar alt={student.fullName} src={student.avatar} />
              </ListItemAvatar>
              <ListItemText primary={`${student.fullName} - (${student.studentId})`} />
            </ListItem>
          ))}
        </List>
        }

        {/* Dialog để thêm học sinh */}
        <Dialog open={isAddStudentDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Add Student</DialogTitle>
          
          <DialogContent>
            <Typography textAlign={'center'} margin={2}>
              - Please enter the email address -
            </Typography>
            <TextField
              label="Email student"
              fullWidth
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              required
            />
            <Typography variant="body2" color="error" mt={2}>
              {message}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddStudentConfirm} color="primary">Send</Button>
          </DialogActions>
        </Dialog>
      </div>}
      </>
    );
  };

export default StudentListTab