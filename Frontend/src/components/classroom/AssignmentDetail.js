import React, { useState, useEffect} from 'react';
import { Typography, TextField, Button, Paper } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api, {setAuthToken} from '../../api/api';

const AssignmentDetail = () => {
  // State để lưu trữ comment từ người dùng
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [assignmentDetail, setAssignmentDetail] = useState(null);

  const navigate = useNavigate();
  const {classId, assignmentId} = useParams();
  // Giả sử các dữ liệu bài tập như tên, nội dung, điểm số đều đến từ API hoặc props
  const assignmentData = {
    name:  'Bài tập số 1',
    content:  'Nội dung bài tập...',
    currentScore: 85,
  };
  useEffect(() => {
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
        const response = await api.get(`/assignments/get/assignment/${assignmentId}`);
        //Lưu thông tin toàn bộ lớp học vào state
        console.log('List Assignment Data: ', response.data);
        //Kiểm tra lại thông tin teacher:
        const list = response.data;
        console.log("list: ", list);
        setAssignmentDetail(list);
        setIsLoading(false);
      } catch (error) {
        // Xử lý lỗi
        if (error.response && error.response.status === 401) {
          navigate('/signin');
        }else{
            console.error('Error fetching user data:', error);
            setIsLoading(false);
        }
      }
    };

    // Gọi hàm lấy dữ liệu 
    fetchAssignmentData();
  }, []); 
  
  // Hàm xử lý khi người dùng thay đổi nội dung comment
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Hàm xử lý khi người dùng nhấn nút Gửi Comment
  const handleCommentSubmit = () => {
    // Gửi comment lên server hoặc thực hiện các xử lý khác tùy thuộc vào yêu cầu
    console.log('Submitted comment:', comment);
  };

  // Hàm xử lý khi người dùng nhấn nút Phúc khảo
  const handleAppealButtonClick = () => {
    // Thực hiện các xử lý khi người dùng nhấn nút Phúc khảo
    console.log('Phúc khảo button clicked');
  };
  //console.log('assignment, classId, isTeaching: ', assignment, classId, isTeaching);
  function handleClickReturn() {
    //navigate(".."); // quay lại trang trước đó
    navigate(`/classroom/class-detail/${classId}`, { state: { currentTab: 3 } });
  }
  return (

    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <Button variant="contained" color="primary" onClick={handleClickReturn}>
        Back
      </Button>
      <Typography variant="h5" gutterBottom>
        {assignmentData.name}
      </Typography>
      <Typography variant="body1" paragraph>
        {assignmentData.content}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Điểm số hiện tại: {assignmentData.currentScore}
      </Typography>
      <TextField
        label="Nhập comment"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={comment}
        onChange={handleCommentChange}
        margin="normal"
      />
      <Button variant="contained" color="primary">
        Gửi Comment
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleAppealButtonClick} style={{ marginLeft: '10px' }}>
        Phúc khảo
      </Button>
    </Paper>
  );
};

export default AssignmentDetail;
