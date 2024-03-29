
import React, { useState, useEffect } from 'react';
import { Outlet, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Tab,
  Tabs,
  Popup,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import api, { setAuthToken } from '../../api/api';
//Các componet của mỗi tab
import ClassInfoTab from './ClassInfoTab';
import TeacherListTab from './TeacherListTab';
import StudentListTab from './StudentListTab';
import GradeBoardTab from './GradeBoardTab';
import AssignmentListTab from './AssignmentListTab';
import AssignmentDetail from './AssignmentDetail';

import GradeStructureTab from './GradeStructureTab';
import GradeReviewListTab from './GradeReviewListTab';

const ClassDetailTab = () => {
  const location = useLocation();
  const [isAddStudentIdDialogOpen, setIsAddStudentIdDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(location.state ? location.state.currentTab : 0);
  const [classInfo, setClassInfo] = useState({});
  const [isTeaching, setIsTeaching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [checkStudentId, setCheckStudentId] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabledSaveButton, setIsDisabledSaveButton] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);

  };
  const handleReturnAssignmentList = () => {
    setSelectedAssignment(null);


  };
  const handleAssignmentClose = () => {
    setSelectedAssignment(null);
    setCurrentTab(3);

  };
  console.log('selectedAssignment: ', selectedAssignment);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const { classId } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy token từ localStorage hoặc nơi lưu trữ khác
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching user data:', Error);
          localStorage.setItem('classId', classId);
          navigate('/signin');
        }
        // Đặt token cho mọi yêu cầu
        setAuthToken(token);
        // Gọi API để lấy dữ liệu danh sách toàn bộ các lớp học của người dùng
        const response = await api.get(`/classes/info/${classId}`);
        //Lưu thông tin toàn bộ lớp học vào state
        console.log('Class Detail Data : ', response.data);
        if (response.data.classInfo.classCode) {
          setIsTeaching(true);
        }
        setClassInfo(response.data.classInfo);
        if (!response.data.checkStudentId) {
          console.log('*********** Do not have StudentID!!!**********');
        }
        setCheckStudentId(response.data.checkStudentId);
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
    fetchUserData();

  }, [navigate, classId]);



  const handleStudentIdChange = (event) => {
    setIsDisabledSaveButton(false);
    setStudentId(event.target.value);
  };

  const handleStudentIdSave = () => {
    setIsDisabledSaveButton(true);
    setIsSaving(true);
    //Gọi API kiểm tra sutdentId có tồn tại chưa?
    console.log('studentId : ', studentId);
    let isSuccess = false;
    const fetchStudentIdData = async () => {
      try {
        const data = { studentId: studentId };
        const response = await api.post('/users/add-studentId', data);
        console.log('Added student Id user: ', response.data);
        if (response.data) {
          isSuccess = true;
          setMessageColor("success.main");
          setMessage(`Save student ID '${studentId}' successfully`);
        } else {
          setMessageColor("error.main");
          setMessage(`Save student ID failed, please try again.`);
          isSuccess = false;
        }
        setIsSaving(false);
        setIsDisabledSaveButton(false);
        console.log(isSuccess);
        setCheckStudentId(isSuccess);
      } catch (error) {
        setIsSaving(false);
        setIsDisabledSaveButton(false);
        // Xử lý lỗi
        if (error.response) {
          switch (error.response.status) {
            case 401:
              navigate('/signin');
              break;
            case 409:
              setMessageColor("error.main");
              setMessage('Save student ID fail. The student ID that you want to use was being used by others. ' +
                'Please enter another student ID and Save again.');
              break;
            default:
              setMessageColor("error.main");
              setMessage('Save student ID fail. Try again!');
          }
        } else {
          setMessageColor("error.main");
          setMessage('Add student ID fail. Try again!');
        }
        setCheckStudentId(false);
        console.error('Error fetching user data :', error);
        // Nếu lỗi là do xác thực (ví dụ: token hết hạn), chuyển hướng về trang đăng nhập
        // if (error.response && error.response.status === 401) {
        //   navigate('/signin');
        // } else {
        //   console.error('Error fetching user data :', error);
        //
        //
        // }
      }
    };
    fetchStudentIdData();
  };
  return (
    <Box sx={{ width: '100%' }}>

      {/* Tabs */}
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="class-detail-tabs"
      >
        <Tab label="Class Information" />
        <Tab label="Teacher List" />
        <Tab label="Student List" />
        <Tab label="Assignment List" />
        <Tab label="Grade Structure" />
        {isTeaching && (<Tab label="Grade board" />)}
        {isTeaching && (<Tab label="Grade Reviews" />)}
      </Tabs>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <ClassInfoTab classInfo={classInfo} isTeaching={isTeaching} />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <TeacherListTab classId={classId} isTeaching={isTeaching} />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <StudentListTab classId={classId} isTeaching={isTeaching} />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <AssignmentListTab classId={classId} isTeaching={isTeaching} onAssignmentClick={handleAssignmentClick} />
      </TabPanel>
      <TabPanel value={currentTab} index={4}>
        <GradeStructureTab classId={classId} isTeaching={isTeaching} />
      </TabPanel>
      {isTeaching && (<TabPanel value={currentTab} index={5}>
        <GradeBoardTab classId={classId} isTeaching={isTeaching} />
      </TabPanel>)}
      {isTeaching && (<TabPanel value={currentTab} index={6}>
        <GradeReviewListTab classId={classId} isTeaching={isTeaching} />
      </TabPanel>)}


      {isLoading ?
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
        :
        <Dialog open={!checkStudentId}>
          <DialogTitle>*** Enter StudentID to join the class! ***</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="studentId"
              label="Student ID"
              type="text"
              fullWidth
              value={studentId}
              onChange={handleStudentIdChange}
            />
            <Typography sx={{ color: messageColor }}><i>{message}</i></Typography>
          </DialogContent>
          <DialogActions>
            <Button disabled={isDisabledSaveButton} onClick={handleStudentIdSave} color="primary">
              <strong>{isSaving ? 'Saving...' : 'Save'}</strong>
            </Button>
          </DialogActions>
        </Dialog>
      }

    </Box>
  );
};

// Component TabPanel để hiển thị nội dung cho mỗi tab
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`class-detail-tabpanel-${index}`}
      aria-labelledby={`class-detail-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default ClassDetailTab;
