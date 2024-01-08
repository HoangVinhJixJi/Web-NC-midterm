import React, { useState } from 'react';
import { Typography, TextField, Button, Paper } from '@mui/material';

const AssignmentDetail = ({assignment, isTeaching, classId, onClose}) => {
  // Giả sử các dữ liệu bài tập như tên, nội dung, điểm số đều đến từ API hoặc props
  const assignmentData = {
    name: assignment.assignmentName || 'Bài tập số 1',
    content: assignment.assignmentContent || 'Nội dung bài tập...',
    currentScore: 85,
  };

  // State để lưu trữ comment từ người dùng
  const [comment, setComment] = useState('');

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

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
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
      <Button variant="contained" color="primary" onClick={() => onClose()}>
        Gửi Comment
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleAppealButtonClick} style={{ marginLeft: '10px' }}>
        Phúc khảo
      </Button>
    </Paper>
  );
};

export default AssignmentDetail;
