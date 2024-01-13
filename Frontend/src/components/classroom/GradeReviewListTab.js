import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Box,
    Card,
    CardContent,
    Icon,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddIcon from '@mui/icons-material/Add';

import api, { setAuthToken } from '../../api/api';

const GradeReviewListTab = ({ classId, isTeaching }) => {
    const [assignments, setAssignments] = useState([]);
    const [gradeReviews, setGradeReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGradeReviewsData = async () => {
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
                const allGradeReviews = await api.get(`/gradeReviews/classId/${classId}`);
                const allAssignments = await api.get(`/assignments/${classId}`);

                const assignmentMap = new Map(allAssignments.data.map(assignment => [assignment._id, assignment]));
                const gradeReviewsWithAssignmentInfo = allGradeReviews.data.map(gradeReview => {
                    const assignment = assignmentMap.get(gradeReview.assignmentId);
                    return {
                        ...gradeReview,
                        assignmentName: assignment ? assignment.assignmentName : null,
                        assignmentContent: assignment ? assignment.assignmentContent : null,
                    };
                });
                console.log(gradeReviewsWithAssignmentInfo);
                setGradeReviews(gradeReviewsWithAssignmentInfo);

            } catch (error) {
                console.error('Error fetching user data:', error);
                setAssignments([]);
            }
            setIsLoading(false);
        };

        fetchGradeReviewsData();
    }, []);


    const handleDiscussClick = (gradeReviewId, assignmentId) => {
        navigate(`/classroom/class-detail/${classId}/assignment-detail/${assignmentId}/gradeReview-detail/${gradeReviewId}`, { state: { isTeaching } });
    };

    const openGradeReviews = gradeReviews.filter((review) => review.status === 'open');
    const closedGradeReviews = gradeReviews.filter((review) => review.status === 'closed');

    return (
        <>
            {assignments && isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" gutterBottom>
                            Grade Review List
                        </Typography>
                    </Grid>
                    <Divider sx={{ margin: '16px 0' }} />
                    {openGradeReviews.length > 0 && (
                        <div>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', m: 3 }} color={'green'}>
                                Open Grade Reviews
                            </Typography>
                            <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                {openGradeReviews.map((review) => (
                                    <Card key={review._id} sx={{ marginBottom: '16px' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <strong>Student ID: </strong> {review.studentId}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <strong>Assignment Name: </strong> {review.assignmentName}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Assignment Description:</strong>
                                                <p>
                                                    {review.assignmentContent}
                                                </p>
                                            </Typography>
                                            <Divider />
                                            <Button variant="outlined" color="primary" startIcon={<Icon>forum</Icon>} sx={{ mt: 2 }} onClick={() => handleDiscussClick(review._id, review.assignmentId)}>
                                                Discuss
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </div>
                    )}

                    {closedGradeReviews.length > 0 && (
                        <div>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', m: 3 }} color={'red'}>
                                Closed Grade Reviews
                            </Typography>
                            <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                {closedGradeReviews.map((review) => (
                                    <Card key={review._id} sx={{ marginBottom: '16px' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <strong>Student ID: </strong> {review.studentId}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <strong>Assignment Name: </strong> {review.assignmentName}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Assignment Description:</strong>
                                                <p>
                                                    {review.assignmentContent}
                                                </p>
                                            </Typography>
                                            <Divider />
                                            <Button variant="outlined" color="primary" startIcon={<Icon>forum</Icon>} sx={{ mt: 2 }} onClick={() => handleDiscussClick(review._id, review.assignmentId)}>
                                                Discuss
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default GradeReviewListTab;
