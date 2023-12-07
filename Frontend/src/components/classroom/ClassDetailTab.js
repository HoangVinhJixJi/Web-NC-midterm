import React from 'react';
import { useParams } from "react-router-dom";
import { Box, Tab, Tabs, Typography } from '@mui/material';

// Các component con cho mỗi tab
const NoticeTab = ({classId}) => <Typography variant="body1"> Nội dung tab Bảng tin Class id = {classId} </Typography>;
const TeacherListTab = () => <Typography variant="body1">Nội dung tab Danh sách giáo viên</Typography>;
const StudentListTab = () => <Typography variant="body1">Nội dung tab Danh sách học sinh</Typography>;

const ClassDetailTab = () => {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const { classId } = useParams();

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
        <Tab label="Bảng tin" />
        <Tab label="Danh sách giáo viên" />
        <Tab label="Danh sách học sinh" />
      </Tabs>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <NoticeTab classId={classId} />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <TeacherListTab />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <StudentListTab />
      </TabPanel>
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
