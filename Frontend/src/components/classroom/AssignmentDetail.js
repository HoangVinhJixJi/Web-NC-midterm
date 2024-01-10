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
    Icon
} from '@mui/material';
import api, { setAuthToken } from '../../api/api'; // Import your API functions

const AssignmentDetail = () => {
    const { classId, assignmentId } = useParams();
    const [message, setMessage] = useState('');
    const [assignment, setAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [gradeReviews, setGradeReviews] = useState([]);
    const [expectedGrade, setExpectedGrade] = useState(null);
    const [explanation, setExplanation] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const location = useLocation();
    const isTeaching = location.state ? location.state.isTeaching : false;
    const [studentId, setStudentId] = useState(null);
    const [currentGrade, setCurrentGrade] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignmentDetail = async () => {
            try {
                const _assignment = await api.get(`/assignments/get/assignment/${assignmentId}`);
                setAssignment(_assignment.data);

                if (!isTeaching) {
                    const u = await api.get('/auth/profile');
                    console.log(u.data);
                    const getStudentId = await api.get(`/classes/my-studentId/${classId}`);
                    const _studentId = getStudentId.data;
                    setStudentId(_studentId);
                    const response = await api.get(`/gradeReviews/${classId}/${assignmentId}/${_studentId.toString()}`);
                    setGradeReviews(response.data);
                    try {
                        const studentGrade = await api.get(`/grades/get/my-grade/${classId}/${assignmentId}`);
                        setCurrentGrade(studentGrade.data.score);
                    }
                    catch {
                        setCurrentGrade('Not Graded Yet');
                    }
                    console.log('STUDENTID', studentId);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching assignment data:', error);
                // Handle error (e.g., redirect to an error page)
            }
        };

        fetchAssignmentDetail();
    }, [assignmentId, studentId]);

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
            <Paper elevation={3} sx={{ padding: '16px', mt: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
                    &lt;Midterm&gt;
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
                        {!openGradeReviews && (currentGrade !== 'Not Graded Yet') && (
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
        </Box>
    );
};

export default AssignmentDetail;
