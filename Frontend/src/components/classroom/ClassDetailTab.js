
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import api, { setAuthToken } from '../../api/api';
//Các componet của mỗi tab
import ClassInfoTab from './ClassInfoTab';
import TeacherListTab from './TeacherListTab';
import StudentListTab from './StudentListTab';
import GradeStructureTab from './GradeStructureTab';
import AssignmentListTab from './AssignmentListTab';
import GradeReviewListTab from './GradeReviewListTab';

const ClassDetailTab = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [classInfo, setClassInfo] = useState({});
  const [isTeaching, setIsTeaching] = useState(false);
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
        if (response.data.classCode) {
          setIsTeaching(true);
        }
        setClassInfo(response.data);


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
        <Tab label="Grade Structure" />
        <Tab label="Assignment" />
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
        <GradeStructureTab classId={classId} isTeaching={isTeaching} />
      </TabPanel>
      <TabPanel value={currentTab} index={4}>
        <AssignmentListTab classId={classId} isTeaching={isTeaching} />
      </TabPanel>
      {isTeaching && (<TabPanel value={currentTab} index={5}>
        <GradeReviewListTab classId={classId} isTeaching={isTeaching} />
      </TabPanel>)}
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
