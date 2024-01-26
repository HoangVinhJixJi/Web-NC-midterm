import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Typography,
    Paper,
    Divider,
    CircularProgress,
    Button,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import { Send as SendIcon, Check as CheckIcon } from '@mui/icons-material';
import api, { setAuthToken } from '../../api/api';
import { useAuth as useAuthContext } from '../../api/AuthContext';
import { io } from 'socket.io-client';

const GradeReviewDetail = () => {
    const { classId, assignmentId, gradeReviewId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const isTeaching = location.state ? location.state.isTeaching : 'null';
    const [gradeReview, setGradeReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isMarkingFinalDecision, setIsMarkingFinalDecision] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [keepOldScore, setKeepOldScore] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    
    const u = JSON.parse(localStorage.getItem('user'));
    const fetchGradeReviewDetail = async () => {
        try {
            if (isTeaching === 'null') {
                navigate('/classroom')
            }
            // Lấy token từ localStorage hoặc nơi lưu trữ khác
            const token = localStorage.getItem('token');
            if (!token) {
            console.error('Error fetching user data:', Error);
            localStorage.setItem('classId', classId);
            navigate('/signin');
            }
            // Đặt token cho mọi yêu cầu
            setAuthToken(token);
            const response = await api.get(`/gradeReviews/gradeReviewId/${gradeReviewId}`);
            if (!response.data) {
                navigate(`/classroom`);
            }
            setGradeReview(response.data);
            setFinalScore(response.data.finalGrade);
            setIsOpen(response.data.status === 'open');

            const comments = await api.get(`/comments/gradeReviewId/${gradeReviewId}`);
            console.log(comments.data);
            setComments(comments.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching assignment data:', error);
        }
    };
    useEffect(() => {

        fetchGradeReviewDetail();
    }, [gradeReviewId]);
    const { isLoggedIn, isAdmin, user, logout } = useAuthContext();
    useEffect(() => {
        // Kiểm tra nếu đã đăng nhập và có token
        if (isLoggedIn) {
            const token = localStorage.getItem('token');

            // Khởi tạo socket và kết nối
            const socket = io(`${process.env.REACT_APP_PUBLIC_URL}`, {
                auth: { token },
            });
            // const socket = io('https://ptudwnc-final-project.vercel.app', {
            //     auth: { token },
            // });
            console.log('dã đăng nhập');

            
            socket.on('request_gradeReview', (data) => {
                console.log('******* New Notification request_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                fetchGradeReviewDetail();
            });
            socket.on('teacher_comment_gradeReview', (data) => {
                console.log('******* New Notification teacher_comment_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                fetchGradeReviewDetail();
            });
            socket.on('fellow_teacher_comment_gradeReview', (data) => {
                console.log('******* New Notification fellow_teacher_comment_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                fetchGradeReviewDetail();
            });
            socket.on('student_comment_gradeReview', (data) => {
                console.log('******* New Notification student_comment_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                fetchGradeReviewDetail();
            });
            socket.on('mark_final_decision_gradeReview', (data) => {
                console.log('******* New Notification mark_final_decision_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                fetchGradeReviewDetail();
            });
            socket.on('fellow_mark_final_decision_gradeReview', (data) => {
                console.log('******* New Notification fellow_mark_final_decision_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                fetchGradeReviewDetail();
            });
            

            
            // Trả về hàm cleanup để ngắt kết nối socket khi component unmount hoặc người dùng đăng xuất
            return () => {
                socket.disconnect();
            };
        }

        // Người dùng không đăng nhập, không cần kết nối socket
        return () => { };
    }, [isLoggedIn]);

    const handleAddComment = async () => {
        if(newComment === ''){
            return ;
        }
        try {
            // Perform API call to add a new comment
            const userData = {
                sendName: u.fullName.toString(),
                message: newComment,
                isTeaching: isTeaching
            }
            const response = await api.post(`/comments/post/${gradeReviewId}`, userData);
            const newCommentData = response.data;

            // Update the local state with the new comment
            setComments((comments)=>[...comments, newCommentData]);

            // Clear the new comment input
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleOpenMarkFinalDecision = () => {
        setIsMarkingFinalDecision(true);
    };

    const handleCloseMarkFinalDecision = () => {
        setIsMarkingFinalDecision(false);
        setFinalScore('');
    };

    const handleMarkFinalDecision = async () => {
        try {
            // Perform API call to mark final decision with either keeping the old score or updating with finalScore
            // const response = await api.post(`/grade-reviews/${gradeReview.id}/mark-final-decision`, {
            //     userId,
            //     keepOldScore: true, // or false based on user's choice
            //     finalScore,
            // });

            // Update the local state based on API response
            // ...
            const newScore = parseFloat(finalScore);
            console.log(keepOldScore);
            if (!keepOldScore) {
                console.log(newScore);
                if (isNaN(newScore) || newScore < 0 || newScore > 100) {
                    setMessage('Invalid new grade!');
                    return;
                }
            }
            const userData = {
                finalGrade: newScore,
                status: 'closed',
                sendName: u.fullName.toString(),
            }
            console.log(userData);
            const response = await api.post(`/gradeReviews/update/${gradeReviewId}`, userData);
            setGradeReview(response.data);

            const gradeData = {
                classId: classId,
                assignmentId: gradeReview.assignmentId,
                studentId: gradeReview.studentId,
                score: newScore,
                status: 'public',
            }
            console.log(gradeData);
            try {
                const updateGrade = await api.post(`/grades/create`, gradeData);
                console.log(updateGrade);
            } catch (error) {
                // Xử lý lỗi
                console.error('Error fetching user data:', error);
                // Nếu lỗi là do xác thực (ví dụ: token hết hạn), chuyển hướng về trang đăng nhập
                if (error.response && error.response.status === 401) {
                    navigate('/signin');
                }
            }
            setIsOpen(false)
            setFinalScore(gradeReview.finalGrade);
            setMessage('');
            handleCloseMarkFinalDecision();
        } catch (error) {
            console.error('Error marking final decision:', error);
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Box m={2} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => window.history.back()}>
                Go Back
            </Button>
            <Divider />
            <Paper elevation={3} sx={{ padding: '16px', mt: 2 }}>
                <TableContainer sx={{ mb: 5 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                                        Student ID
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                                        Final Score
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={gradeReview.studentId}>
                                <TableCell align="center">
                                    <Typography variant="subtitle1" color="secondary">
                                        {gradeReview.studentId}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="subtitle1" color="secondary">
                                        {gradeReview.finalGrade}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
                    Expected Grade: {gradeReview.expectedGrade}
                </Typography>
                <Typography paragraph sx={{ textAlign: 'justify' }}>
                    <strong>Explanation:</strong>
                    <p>
                        {gradeReview.message}
                    </p>
                </Typography>
                {isTeaching && isOpen && (
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleOpenMarkFinalDecision}>
                        Mark Final Decision
                    </Button>
                )}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                    Comments
                </Typography>
                <List sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {comments.map((comment) => (
                        <ListItem key={comment._id} alignItems="center">
                            <ListItemAvatar>
                                <Avatar alt={comment.sendId} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            {comment.sendName}
                                        </Typography>
                                        <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                                            {comment.message}
                                        </Typography>
                                    </React.Fragment>
                                }
                                secondary={<Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>{comment.postAt}</Typography>}
                            />
                        </ListItem>
                    ))}
                </List>
                {isOpen && (
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        label="Add a comment"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleAddComment}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mt: 2 }}
                    />
                )}
            </Paper>
            <Dialog open={isMarkingFinalDecision} onClose={handleCloseMarkFinalDecision}>
                <DialogTitle>Mark Final Decision</DialogTitle>
                <DialogContent sx={{ width: '400px' }}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="mark-final-decision"
                            name="mark-final-decision"
                            value={keepOldScore ? 'keep' : 'update'}
                            onChange={(e) => setKeepOldScore(e.target.value === 'keep')}
                        >
                            <FormControlLabel value="keep" control={<Radio />} label="Keep Old Score" />
                            <FormControlLabel value="update" control={<Radio />} label="Update with New Score" />
                        </RadioGroup>
                    </FormControl>
                    {keepOldScore ? null : (
                        <>
                            <TextField
                                fullWidth
                                label="New Score"
                                value={finalScore}
                                onChange={(e) => setFinalScore(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <Typography variant="body2" color="error" mt={2}>
                                {message}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMarkFinalDecision}>Cancel</Button>
                    <Button onClick={handleMarkFinalDecision} color="primary" variant="contained">
                        <CheckIcon />
                        Mark Final Decision
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GradeReviewDetail;
