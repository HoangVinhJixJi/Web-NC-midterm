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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Icon,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import api, { setAuthToken } from '../../api/api'; // Import your API functions

const AssignmentDetail = () => {
    const { classId, assignmentId } = useParams();
    const [message, setMessage] = useState('');
    const [assignment, setAssignment] = useState(null);
    const [gradeComposition, setGradeComposition] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [gradeReviews, setGradeReviews] = useState([]);
    const [expectedGrade, setExpectedGrade] = useState(null);
    const [explanation, setExplanation] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const location = useLocation();
    const isTeaching = location.state ? location.state.isTeaching : 'null';
    const [studentId, setStudentId] = useState(null);
    const [currentGrade, setCurrentGrade] = useState(null);
    const [isUpdateAssignmentDialogOpen, setIsUpdateAssignmentDialogOpen] = useState(false);
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentContent, setAssignmentContent] = useState('');
    const [gradingScales, setGradingScales] = useState([]);
    const [selectedScale, setSelectedScale] = useState('');


    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const timestamp = urlParams.get('timestamp');

    //fetch lấy thông tin bài tập
    const fetchAssignmentDetail = async () => {
        try {
            if (isTeaching === 'null') {
                navigate('/classroom')
            }
            console.log('timestamp', timestamp);
            // Lấy token từ localStorage hoặc nơi lưu trữ khác
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Error fetching user data:', Error);
                localStorage.setItem('classId', classId);
                navigate('/signin');
            }
            // Đặt token cho mọi yêu cầu
            setAuthToken(token);
            const _assignment = await api.get(`/assignments/get/assignment/${assignmentId}`);
            setAssignment(_assignment.data);
            const _gradeComposition = await api.get(`gradeStructures/detail/${_assignment.data.gradeStructureId}`);
            setGradeComposition(_gradeComposition.data);

            if (!isTeaching) {
                const getStudentId = await api.get(`/classes/my-studentId/${classId}`);
                const _studentId = getStudentId.data;
                setStudentId(_studentId);
                const response = await api.get(`/gradeReviews/${classId}/${assignmentId}/${_studentId.toString()}`);
                if (response.data) {
                    setGradeReviews(response.data);
                }
                try {
                    const studentGrade = await api.get(`/grades/get/my-grade/${classId}/${assignmentId}`);
                    const gradeFetch = studentGrade.data.score;
                    if (gradeFetch !== null) {
                        setCurrentGrade(gradeFetch);
                    } else {
                        setCurrentGrade('Not Published Yet');
                    }
                }
                catch {
                    setCurrentGrade('Not Graded Yet');
                }
                console.log('STUDENTID', studentId);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching assignment data:', error);
            navigate(`/classroom`);
            
        }
    };
    //Lấy grade structure 
    const fetchGradingScales = async () => {
        try {
            const response = await api.get(`/gradeStructures/${classId}`);
            console.log('List gradeStuctures Data: ', response.data);
            if (response.data) {
                setGradingScales(response.data);
            }
            setIsLoading(false);
        } catch (error) {
            navigate('/signin');
        }
    };

    useEffect(() => {
        fetchAssignmentDetail();
    }, [assignmentId, timestamp]);

    const handleGoBack = () => {
        // navigate(-1); // Navigate back to the AssignmentList
        navigate(`/classroom/class-detail/${classId}`, { state: { currentTab: 3 } });
    };

    const handleDiscussClick = (gradeReviewId, isOpen) => {
        navigate(`/classroom/class-detail/${classId}/assignment-detail/${assignmentId}/gradeReview-detail/${gradeReviewId}`, { state: { isTeaching, isOpen } });
    }
    const handleOpenForm = () => {
        setIsFormOpen(true);
    };
    const handleCloseForm = () => {
        setIsFormOpen(false);
    };
    const handleCloseDialog = () => {
        fetchAssignmentDetail();
        setIsUpdateAssignmentDialogOpen(false);
        setMessage('');
    };

    const handleSubmitForm = async () => {
        // Handle form submission, e.g., make an API call to submit the grade review

        const _expectedGrade = parseFloat(expectedGrade);
        if (isNaN(_expectedGrade) || _expectedGrade < 0 || _expectedGrade > 100) {
            setMessage('Invalid expected grade!');
            return;
        }

        if (!explanation.trim()) {
            setMessage('Explanation is required!');
            return;
        }

        const userData = {
            studentId: studentId.toString(),
            finalGrade: parseFloat(currentGrade),
            expectedGrade: _expectedGrade,
            message: explanation.toString(),
        };
        const response = await api.post(`/gradeReviews/add/${classId}/${assignmentId}`, userData);
        console.log(response);

        // Update the gradeReviews state
        setGradeReviews((gradeReviews) => [...gradeReviews, response.data]);
        // Close the form
        setExpectedGrade(null);
        setExplanation('');
        setMessage('');
        handleCloseForm();
    };

    //Mở dialog update assignment
    const handleUpdateAssignmentClick = () => {
        setIsUpdateAssignmentDialogOpen(true);
        setAssignmentName(assignment.assignmentName);
        setAssignmentContent(assignment.assignmentContent);
        setSelectedScale(assignment.gradeStructureId);
        fetchGradingScales();
    }
    //Cập nhật assignment
    const handleUpdateAssignmentConfirm = async () => {
        // Kiểm tra hợp lệ 
        try {
            if (assignmentName) {
                const allAssignments = await api.get(`/assignments/${classId}`);
                console.log(allAssignments.data);
                const check = allAssignments.data.find(item => item.assignmentName === assignmentName && item._id !== assignment._id);
                if (check) {
                    setMessage('Assignment Name is already in the class!');
                }
                else {
                    const res = await api.post(`/assignments/update`, {
                        _id: assignment._id,
                        assignmentName,
                        assignmentContent,
                        classId,
                        maxScore: 100,
                        gradeStructureId: selectedScale,
                    });
                    console.log('res create assignment: ', res);
                    if (res.data) {
                        setMessage('Update Assignment successfully!');
                    } else {
                        throw new Error('Update Assignment fail');
                    }

                }
            } else {
                // Hiển thị thông báo lỗi hoặc thực hiện hành động phù hợp
                setMessage('Please enter Assignment Name!');
            }
        } catch (error) {
            console.error(error);
            setMessage('Update Assignment fail!');
        }

    };

    if (isLoading) {
        return <CircularProgress />;
    }

    const openGradeReviews = gradeReviews.filter((review) => review.status === 'open').length > 0 ? true : false;

    return (
        <Box m={2} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Button variant="contained" color="primary" onClick={handleGoBack} sx={{ mb: 2 }}>
                Go Back To The Class
            </Button>

            <Divider />
            <Paper elevation={3} sx={{ padding: '16px', m: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
                    &lt;{gradeComposition.name}&gt;
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {assignment.assignmentName}
                </Typography>
                <Typography variant="body1" paragraph>
                    {assignment.assignmentContent}
                </Typography>

                {!isTeaching && (<>
                    {/* Display student ID and score in a table */}
                    <TableContainer>
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
                                <TableRow key={studentId}>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1" color="secondary">
                                            {studentId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1" color="secondary">
                                            {currentGrade}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Grade Reviews Section */}
                    {gradeReviews.length > 0 && (
                        <div>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                                Grade Reviews
                            </Typography>
                            <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                {gradeReviews.map((review) => (
                                    <Card key={review._id} sx={{ marginBottom: '16px' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                Expected Grade: {review.expectedGrade}
                                            </Typography>
                                            <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                                                <strong>Explanation:</strong>
                                                <p>
                                                    {review.message}
                                                </p>
                                            </Typography>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }} color={review.status === 'open' ? 'green' : 'red'}>
                                                Status: {review.status.toUpperCase()}
                                            </Typography>
                                            <Button variant="outlined" color="primary" startIcon={<Icon>forum</Icon>} sx={{ mt: 2 }} onClick={() => handleDiscussClick(review._id, review.status === 'open' ? true : false)}>
                                                Discuss
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </div>
                    )}


                    {/* Form for Submitting Grade Review */}
                    <div>
                        {!openGradeReviews && (currentGrade !== 'Not Graded Yet') && (currentGrade !== 'Not Published Yet') && (
                            <Button variant="contained" color="primary" onClick={handleOpenForm} sx={{ mt: 2 }}>
                                Request A Grade Review
                            </Button>
                        )}
                        <Dialog open={isFormOpen} onClose={handleCloseForm}>
                            <DialogTitle>Request A Grade Review</DialogTitle>
                            <DialogContent>
                                <TextField
                                    label="Expected Grade"
                                    fullWidth
                                    onChange={(e) => setExpectedGrade(e.target.value)}
                                    required
                                    sx={{ mt: 2 }}
                                />
                                <TextField
                                    label="Explanation"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    onChange={(e) => setExplanation(e.target.value)}
                                    required
                                    sx={{ mt: 2 }}
                                />
                                <Typography variant="body2" color="error" mt={2}>
                                    {message}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" color="primary" onClick={handleSubmitForm}>
                                    Submit
                                </Button>
                                <Button variant="outlined" onClick={handleCloseForm}>
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </>)}
            </Paper>
            <Divider />
            {isTeaching &&
                <Button variant="contained" color="primary" onClick={handleUpdateAssignmentClick} sx={{ mt: 2 }}>
                    Update Assignment
                </Button>
            }
            <Dialog open={isUpdateAssignmentDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Update Assignment</DialogTitle>
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
                    <Button onClick={handleUpdateAssignmentConfirm} color="primary">Create</Button>
                </DialogActions>

            </Dialog>
        </Box>
    );
};

export default AssignmentDetail;
