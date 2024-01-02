// // AssignmentDetail.js

// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { Typography, Paper, Divider, CircularProgress, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';
// import api, { setAuthToken } from '../../api/api'; // Import your API functions

// const AssignmentDetail = () => {
//     const { assignmentId } = useParams();
//     const [assignment, setAssignment] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const location = useLocation();
//     const isTeaching = location.state ? location.state.isTeaching : false;
//     const userId = '123';
//     const studentScores = {
//         studentId: '20120602', score: 100  
//     };
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchAssignmentDetail = async () => {
//             try {
//                 // const token = localStorage.getItem('token');
//                 // if (!token) {
//                 //     console.error('Error fetching user data:', Error);
//                 //     // Redirect or handle unauthorized access
//                 // }
//                 // setAuthToken(token);

//                 // Uncomment the above lines when using actual API calls
//                 // For testing, replace the API call with sample assignment data
//                 const sampleAssignmentData = {
//                     _id: assignmentId,
//                     assignmentName: 'Sample Assignment 1',
//                     assignmentContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat.',
//                 };

//                 // Comment out the following line when using actual API calls
//                 setAssignment(sampleAssignmentData);

//                 setIsLoading(false);
//             } catch (error) {
//                 console.error('Error fetching assignment data:', error);
//                 // Handle error (e.g., redirect to an error page)
//             }
//         };

//         fetchAssignmentDetail();
//     }, [assignmentId, userId]);

//     const handleGoBack = () => {
//         navigate(-1); // Navigate back to the AssignmentList
//     };

//     if (isLoading) {
//         return <CircularProgress />;
//     }

//     if (!assignment) {
//         return <div>No assignment found.</div>; // Handle the case where the assignment is not found
//     }

//     return (
//         <Box m={2}>
//             <Typography variant="h4" gutterBottom>
//                 Assignment Detail
//             </Typography>
//             <Button variant="contained" color="primary" onClick={handleGoBack} sx={{ mb: 2 }}>
//                 Go Back To The Class
//             </Button>
//             <Divider />
//             <Paper elevation={3} sx={{ padding: '16px', mt: 2 }}>
//                 <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//                     {assignment.assignmentName}
//                 </Typography>
//                 <Typography variant="body1" paragraph>
//                     {assignment.assignmentContent}
//                 </Typography>

//                 {/* Display student ID and score in a table */}
//                 <TableContainer>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell align="center">
//                                     <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
//                                         Student ID
//                                     </Typography>
//                                 </TableCell>
//                                 <TableCell align="center">
//                                     <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
//                                         Final Score
//                                     </Typography>
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             <TableRow key={userId}>
//                                 <TableCell align="center">
//                                     <Typography variant="subtitle1" color="secondary">
//                                         {userId}
//                                     </Typography>
//                                 </TableCell>
//                                 <TableCell align="center">
//                                     <Typography variant="subtitle1" color="secondary">
//                                         {studentScores.score}
//                                     </Typography>
//                                 </TableCell>
//                             </TableRow>
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Box>
//     );
// };

// export default AssignmentDetail;


// AssignmentDetail.js

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
    const userId = '123';
    const studentScores = {
        studentId: '20120602',
        score: 100,
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignmentDetail = async () => {
            try {
                const sampleAssignmentData = {
                    _id: assignmentId,
                    assignmentName: 'Sample Assignment 1',
                    assignmentContent:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat.',
                };

                // Comment out the following line when using actual API calls
                setAssignment(sampleAssignmentData);

                // Fetch grade reviews for the assignment
                const sampleGradeReviews = [
                    { id: 1, expectedGrade: 'A', explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', status: 'open' },
                    { id: 2, expectedGrade: 'B', explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', status: 'close' },
                    // Add more grade reviews if needed
                ];

                // Comment out the following line when using actual API calls
                setGradeReviews(sampleGradeReviews);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching assignment data:', error);
                // Handle error (e.g., redirect to an error page)
            }
        };

        fetchAssignmentDetail();
    }, [assignmentId, userId]);

    const handleGoBack = () => {
        navigate(-1); // Navigate back to the AssignmentList
    };
    
    const handleDiscussClick = (gradeReviewId) => {
        navigate(`/classroom/class-detail/${classId}/assignment/${assignmentId}/gradeReview/${gradeReviewId}`, { state: { isTeaching } });
    }

    const handleOpenForm = () => {
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    const handleSubmitForm = () => {
        // Handle form submission, e.g., make an API call to submit the grade review
        const newReview = {
            id: gradeReviews.length + 1,
            expectedGrade,
            explanation,
            status: 'open'
        };
        
        const _expectedGrade = parseFloat(expectedGrade);
        if (isNaN(_expectedGrade) || _expectedGrade < 0 || _expectedGrade > 100) {
            setMessage('Invalid expected grade!');
            return;
        }
        
        if (!explanation.trim()) {
            setMessage('Explanation is required!');
            return;
        }
            

        // Update the gradeReviews state
        setGradeReviews([...gradeReviews, newReview]);

        // Close the form
        setExpectedGrade(null);
        setExplanation('');
        setMessage('');
        handleCloseForm();
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (!assignment) {
        return <div>No assignment found.</div>; // Handle the case where the assignment is not found
    }

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
                            <TableRow key={userId}>
                                <TableCell align="center">
                                    <Typography variant="subtitle1" color="secondary">
                                        {userId}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="subtitle1" color="secondary">
                                        {studentScores.score}
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
                                <Card key={review.id} sx={{ marginBottom: '16px' }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            Expected Grade: {review.expectedGrade}
                                        </Typography>
                                        <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                                            <strong>Explanation:</strong>
                                            <p>
                                                {review.explanation}
                                            </p>
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }} color={review.status === 'open' ? 'green' : 'red'}>
                                            Status: {review.status.toUpperCase()}
                                        </Typography>
                                        <Button variant="outlined" color="primary" startIcon={<Icon>forum</Icon>} sx={{ mt: 2 }} onClick={()=>handleDiscussClick(review.id)}>
                                            Discuss
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </div>
                )}


                {/* Form for Submitting Grade Review */}
                {isTeaching === false && (
                    <div>
                        <Button variant="contained" color="primary" onClick={handleOpenForm} sx={{ mt: 2 }}>
                            Request A Grade Review
                        </Button>
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
                )}
            </Paper>
        </Box>
    );
};

export default AssignmentDetail;
