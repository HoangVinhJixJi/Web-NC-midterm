// // import React, { useEffect, useState } from 'react';
// // import { useParams, useNavigate, useLocation } from 'react-router-dom';
// // import {
// //     Typography,
// //     Paper,
// //     Divider,
// //     CircularProgress,
// //     Button,
// //     Table,
// //     TableContainer,
// //     TableHead,
// //     TableRow,
// //     TableCell,
// //     TableBody,
// //     Box,
// // } from '@mui/material';
// // import api, { setAuthToken } from '../../api/api'; // Import your API functions

// // const GradeReviewDetail = () => {
// //     const { classId, assignmentId } = useParams();
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [gradeReview, setGradeReview] = useState(null);
// //     const location = useLocation();
// //     const isTeaching = location.state ? location.state.isTeaching : false;
// //     const userId = '123';
// //     const studentScores = {
// //         studentId: '20120602',
// //         score: 100,
// //     };
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         const fetchGradeReviewDetail = async () => {
// //             try {
// //                 // Fetch grade reviews for the assignment
// //                 const sampleGradeReview = { id: 1, expectedGrade: 'A', explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', status: 'open' };

// //                 // Comment out the following line when using actual API calls
// //                 setGradeReview(sampleGradeReview);

// //                 setIsLoading(false);
// //             } catch (error) {
// //                 console.error('Error fetching assignment data:', error);
// //                 // Handle error (e.g., redirect to an error page)
// //             }
// //         };

// //         fetchGradeReviewDetail();
// //     }, [assignmentId, userId]);

// //     const handleGoBack = () => {
// //         navigate(-1); // Navigate back to the AssignmentList
// //     };

// //     if (isLoading) {
// //         return <CircularProgress />;
// //     }

// //     return (
// //         <Box m={2} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
// //             <Button variant="contained" color="primary" onClick={handleGoBack} sx={{ mb: 2 }}>
// //                 Go Back
// //             </Button>
// //             <Divider />
// //             <Paper elevation={3} sx={{ padding: '16px', mt: 2 }}>
// //                 <TableContainer sx={{ mb: 5 }}>
// //                     <Table>
// //                         <TableHead>
// //                             <TableRow>
// //                                 <TableCell align="center">
// //                                     <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
// //                                         Student ID
// //                                     </Typography>
// //                                 </TableCell>
// //                                 <TableCell align="center">
// //                                     <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
// //                                         Current Score
// //                                     </Typography>
// //                                 </TableCell>
// //                             </TableRow>
// //                         </TableHead>
// //                         <TableBody>
// //                             <TableRow key={userId}>
// //                                 <TableCell align="center">
// //                                     <Typography variant="subtitle1" color="secondary">
// //                                         {userId}
// //                                     </Typography>
// //                                 </TableCell>
// //                                 <TableCell align="center">
// //                                     <Typography variant="subtitle1" color="secondary">
// //                                         {studentScores.score}
// //                                     </Typography>
// //                                 </TableCell>
// //                             </TableRow>
// //                         </TableBody>
// //                     </Table>
// //                 </TableContainer>
// //                 <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
// //                     Expected Grade: {gradeReview.expectedGrade}
// //                 </Typography>
// //                 <Typography paragraph sx={{ textAlign: 'justify' }}>
// //                     <strong>Explanation:</strong>
// //                     <p>
// //                         {gradeReview.explanation}
// //                     </p>
// //                 </Typography>
// //             </Paper>
// //         </Box>
// //     );
// // };

// // export default GradeReviewDetail;

// import React, { useEffect, useState } from 'react';
// import {
//     Typography,
//     Paper,
//     Divider,
//     CircularProgress,
//     Button,
//     Table,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableCell,
//     TableBody,
//     Box,
//     TextField,
//     List,
//     ListItem,
//     ListItemText,
//     ListItemAvatar,
//     Avatar,
//     IconButton,
//     InputAdornment,
// } from '@mui/material';
// import { Send as SendIcon } from '@mui/icons-material';
// import api, { setAuthToken } from '../../api/api';

// const GradeReviewDetail = () => {
//     const [isLoading, setIsLoading] = useState(true);
//     const [gradeReview, setGradeReview] = useState(null);
//     const [comments, setComments] = useState([]);
//     const [newComment, setNewComment] = useState('');
//     const userId = '123';
//     const studentScores = {
//             studentId: '20120602',
//             score: 100,
//     };

//     useEffect(() => {
//         const fetchGradeReviewDetail = async () => {
//             try {
//                 const sampleGradeReview = {
//                     id: 1,
//                     expectedGrade: 'A',
//                     explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat',
//                     status: 'open',
//                 };

//                 const sampleComments = [
//                     { id: 1, userId: 'teacher1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', timestamp: '2022-01-07T12:30:45Z' },
//                     { id: 2, userId: 'student123', content: 'Thank you!', timestamp: '2022-01-07T12:45:00Z' },
//                     { id: 3, userId: 'teacher1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', timestamp: '2022-01-07T12:30:45Z' },
//                     { id: 4, userId: 'teacher1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', timestamp: '2022-01-07T12:30:45Z' },
//                     { id: 5, userId: 'teacher1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', timestamp: '2022-01-07T12:30:45Z' },
//                 ];

//                 setGradeReview(sampleGradeReview);
//                 setComments(sampleComments);

//                 setIsLoading(false);
//             } catch (error) {
//                 console.error('Error fetching assignment data:', error);
//             }
//         };

//         fetchGradeReviewDetail();
//     }, []);

//     const handleAddComment = async () => {
//         try {
//             // Perform API call to add a new comment
//             const response = await api.post(`/grade-reviews/${gradeReview.id}/comments`, {
//                 userId,
//                 content: newComment,
//             });

//             const newCommentData = response.data;

//             // Update the local state with the new comment
//             setComments([...comments, newCommentData]);

//             // Clear the new comment input
//             setNewComment('');
//         } catch (error) {
//             console.error('Error adding comment:', error);
//         }
//     };

//     if (isLoading) {
//         return <CircularProgress />;
//     }

//     return (
//         <Box m={2} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//             <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => window.history.back()}>
//                 Go Back
//             </Button>
//             <Divider />
//             <Paper elevation={3} sx={{ padding: '16px', mt: 2 }}>
//                 <TableContainer sx={{ mb: 5 }}>
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
//                                         Current Score
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
//                 <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
//                     Expected Grade: {gradeReview.expectedGrade}
//                 </Typography>
//                 <Typography paragraph sx={{ textAlign: 'justify' }}>
//                     <strong>Explanation:</strong>
//                     <p>
//                         {gradeReview.explanation}
//                     </p>
//                 </Typography>
//                 <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
//                     Comments
//                 </Typography>
//                 <List sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
//                     {comments.map((comment) => (
//                         <ListItem key={comment.id} alignItems="center">
//                             <ListItemAvatar>
//                                 <Avatar alt={comment.userId} />
//                             </ListItemAvatar>
//                             <ListItemText
//                                 primary={
//                                     <React.Fragment>
//                                         <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                             {comment.userId}
//                                         </Typography>
//                                         <Typography variant="body1" sx={{ textAlign: 'justify' }}>
//                                             {comment.content}
//                                         </Typography>
//                                     </React.Fragment>
//                                 }
//                                 secondary={<Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>{comment.timestamp}</Typography>}
//                             />
//                         </ListItem>
//                     ))}

//                 </List>
//                 <TextField
//                     fullWidth
//                     multiline
//                     rows={3}
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     label="Add a comment"
//                     InputProps={{
//                         endAdornment: (
//                             <InputAdornment position="end">
//                                 <IconButton onClick={handleAddComment}>
//                                     <SendIcon />
//                                 </IconButton>
//                             </InputAdornment>
//                         ),
//                     }}
//                     sx={{ mt: 2 }}
//                 />
//             </Paper>
//         </Box>
//     );
// };

// export default GradeReviewDetail;

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

const GradeReviewDetail = () => {
    const { classId, assignmentId, gradeReviewId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const isTeaching = location.state ? location.state.isTeaching : false;
    const [gradeReview, setGradeReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isMarkingFinalDecision, setIsMarkingFinalDecision] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [keepOldScore, setKeepOldScore] = useState(true);
    const [message, setMessage] = useState('');

    const [isOpen, setIsOpen] = useState(location.state ? location.state.isOpen : false);

    useEffect(() => {
        const fetchGradeReviewDetail = async () => {
            try {
                // const sampleGradeReview = {
                //     id: 1,
                //     expectedGrade: 'A',
                //     explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat',
                //     status: 'open',
                // };
                // setGradeReview(sampleGradeReview);

                const response = await api.get(`/gradeReviews/gradeReviewId/${gradeReviewId}`);
                setGradeReview(response.data);
                setFinalScore(response.data.finalGrade);

                // const sampleComments = [
                //     { id: 1, userId: 'teacher1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', timestamp: '2022-01-07T12:30:45Z' },
                //     { id: 2, userId: 'student123', content: 'Thank you!', timestamp: '2022-01-07T12:45:00Z' },
                //     { id: 3, userId: 'teacher1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', timestamp: '2022-01-07T12:30:45Z' },
                //     { id: 4, userId: 'teacher1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', timestamp: '2022-01-07T12:30:45Z' },
                //     { id: 5, userId: 'teacher1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan urna nec vestibulum cursus. Integer euismod justo vitae lacus varius, vel malesuada velit feugiat', timestamp: '2022-01-07T12:30:45Z' },
                // ];
                // setComments(sampleComments);

                const comments = await api.get(`/comments/gradeReviewId/${gradeReviewId}`);
                console.log(comments.data);
                setComments(comments.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching assignment data:', error);
            }
        };

        fetchGradeReviewDetail();
    }, []);

    const handleAddComment = async () => {
        try {
            // Perform API call to add a new comment
            const u = await api.get('/auth/profile');
            console.log(u.data);
            const userData = {
                sendId: u.data.userId,
                sendName: u.data.fullName.toString(),
                message: newComment
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
            }
            console.log(userData);
            const response = await api.post(`/gradeReviews/update/${gradeReviewId}`, userData);
            setGradeReview(response.data);
            console.log(response.data);
            setIsOpen(false)
            setFinalScore(gradeReview.currentGrade);
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
