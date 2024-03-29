import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Button, 
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Grid,
  CircularProgress,
  ListItemButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import api, {setAuthToken} from '../../api/api';

const AssignmentListTab = ({classId, isTeaching, onAssignmentClick}) => {
  const sampleGradingScales = [
    { id: '1', name: 'Assignment', scale: 30 },
    { id: '2', name: 'Midterm', scale: 40 },
    { id: '3', name: 'Final', scale: 60 },
  ];
  const [isAddAssignmentDialogOpen, setIsAddAssignmentDialogOpen] = useState(false);
  const [assignmentName, setAssignmentName] = useState('');
  const [assignmentContent, setAssignmentContent] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [gradingScales, setGradingScales] = useState([]); 
  const [selectedScale, setSelectedScale] = useState(''); 
  const navigate = useNavigate();
  const fetchAssignmentData = async () => {
    try {
      // Lấy token từ localStorage hoặc nơi lưu trữ khác
      const token = localStorage.getItem('token');
      if(!token){
        console.error('Error fetching user data:', Error);
        navigate('/signin');
      }
      // Đặt token cho mọi yêu cầu
      setAuthToken(token);
      // Gọi API để lấy dữ liệu danh sách toàn bộ các giáo viên của lớp học
      const response = await api.get(`/assignments/${classId}`);
      //Lưu thông tin toàn bộ lớp học vào state
      console.log('List Assignment Data: ', response.data);
      //Kiểm tra lại thông tin teacher:
      const list = response.data;
      console.log("list: ", list);
      setAssignments(list);
      setIsLoading(false);
    } catch (error) {
      // Xử lý lỗi
      if (error.response && error.response.status === 401) {
        navigate('/signin');
      }else{
          console.error('Error fetching user data:', error);
          setAssignments([]);
          setIsLoading(false);
      }
    }
  };
  const fetchGradingScales = async () => {
    try {
      const response = await api.get(`/gradeStructures/${classId}`);
      console.log('List gradeStuctures Data: ', response.data);
      if(response.data){
        setGradingScales(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
        navigate('/signin');
    }
  };
  

  useEffect(() => {
    // Gọi hàm lấy dữ liệu 
    fetchAssignmentData();
    fetchGradingScales();
  }, []); 
  
  const handleAssignmentClick = (assignmentId) => {
      // Navigate to the detailed view of the assignment using the assignmentId
      navigate(`/classroom/class-detail/${classId}/assignment-detail/${assignmentId}`, { state: { isTeaching } });
      // navigate(`assignment/${assignmentId}`, { state: { isTeaching } });
  };

  const handleAddAssignmentClick = () => {
    setIsAddAssignmentDialogOpen(true);
  };
  const handleCloseDialog = () => {
    fetchAssignmentData();
    setIsAddAssignmentDialogOpen(false);
    setMessage('');
  };

  const handleAddAssignmentConfirm = async() => {
    // Kiểm tra hợp lệ 
    if (assignmentName) {
      const allAssignments = await api.get(`/assignments/${classId}`);
      const check = allAssignments.data.includes(assignmentName);
      if (check) {
        setMessage('Assignment Name is already in the class!');
      }
      else {
        const res = await api.post(`/assignments/create`, {
            assignmentName,
            assignmentContent,
            classId,
            maxScore: 100,
            gradeStructureId: selectedScale,
        });
        console.log('res create assignment: ', res);
        setMessage('Create New Assignment successfully!');
      }
    } else {
      // Hiển thị thông báo lỗi hoặc thực hiện hành động phù hợp
      setMessage('Please enter Assignment Name!');
    }
  };
  
  return (
    <>
    { assignments && isLoading ? 
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
      :
    <div>
    <Grid container alignItems="center" justifyContent="space-between">
      <Typography variant="h6" gutterBottom>
          Assignment List
      </Typography>
      { isTeaching &&
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddAssignmentClick}
          >
            Add
          </Button>
        
        </Grid>
      }
    </Grid>
    <Divider sx={{ margin: '16px 0' }} />
      {assignments && <List sx={{overflowY: 'auto', maxHeight: 'calc(100vh - 160px)'}}>
        {assignments.map((assignment) => (
          <ListItemButton 
          onClick={() => handleAssignmentClick(assignment._id)}
          key={assignment._id} 
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <AssignmentIcon sx={{marginRight: '16px', color: 'orange'}}/>
            <ListItem>
              <ListItemText   
                secondary={
                    <Typography
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 1,
                        paddingRight: '8px',
                      }}
                      variant='body2'
                    >
                      {assignment.assignmentContent}
                    </Typography>}
                primary={
                <Typography variant='body' fontWeight='bold'>
                  {assignment.assignmentName}
                </Typography>} />
            </ListItem>  
            
            
          </ListItemButton>
        ))}
      </List>
      }

      {/* Dialog để thêm học sinh */}

      { gradingScales.length === 0 ? 
        <Dialog open={isAddAssignmentDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Error </DialogTitle>
          <DialogContent>You need to have at least one grade compositon to add an assignment</DialogContent>
          <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
        </Dialog>
        :
      <Dialog open={isAddAssignmentDialogOpen} onClose={handleCloseDialog}>
        
        <DialogTitle>Add Assignment</DialogTitle>
        
        <DialogContent>
          
          <TextField
            label="Assignment Name"
            fullWidth
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            required
            sx={{ marginY: 2 }}
          />
          <TextField
            label="Assignment Content"
            fullWidth
            value={assignmentContent}
            onChange={(e) => setAssignmentContent(e.target.value)}
            required
            sx={{ marginY: 2 }}
          />

          <FormControl fullWidth sx={{ marginY: 2 }}>
            <InputLabel id="grading-scale-select-label"> Grading Scale </InputLabel>
            <Select
              labelId="grading-scale-select-label"
              id="grading-scale-select"
              value={selectedScale}
              label="Grading Scale"
              onChange={(e) => setSelectedScale(e.target.value)}
            >
              
              {gradingScales.map((scale) => (
                <MenuItem key={scale._id} value={scale._id}>
                  {scale.name} - {scale.scale}%
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="error" mt={2}>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddAssignmentConfirm} color="primary">Create</Button>
        </DialogActions>
        
      </Dialog>
      }
    </div>}
    </>
  );
    
};

export default AssignmentListTab

