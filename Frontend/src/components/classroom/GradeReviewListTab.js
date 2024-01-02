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

const GradeReviewListTab = ({ classId, isTeaching }) => {
    const { assignmentId } = useParams();
    const [isAddAssignmentDialogOpen, setIsAddAssignmentDialogOpen] = useState(false);
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentContent, setAssignmentContent] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [gradeReviews, setGradeReviews] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGradeReviewsData = async () => {
            try {
                // Simulate API call delay (remove this in the actual implementation)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Fetch grade reviews for the assignment
                const sampleGradeReviews = [
                    { id: 1, studentId: '20120602', assignmentId: '1234', status: 'open' },
                    { id: 2, studentId: '20120602', assignmentId: '1234', status: 'open' },
                    { id: 2, studentId: '20120602', assignmentId: '1234', status: 'open' },
                    { id: 2, studentId: '20120602', assignmentId: '1234', status: 'open' },
                    { id: 2, studentId: '20120602', assignmentId: '1234', status: 'open' },
                    { id: 3, studentId: '20120602', assignmentId: '1234', status: 'closed' },
                    { id: 4, studentId: '20120602', assignmentId: '1234', status: 'closed' },
                    { id: 4, studentId: '20120602', assignmentId: '1234', status: 'closed' },
                    { id: 4, studentId: '20120602', assignmentId: '1234', status: 'closed' },
                    { id: 4, studentId: '20120602', assignmentId: '1234', status: 'closed' },
                    { id: 4, studentId: '20120602', assignmentId: '1234', status: 'closed' },
                    // Add more grade reviews if needed
                ];

                // Comment out the following line when using actual API calls
                setGradeReviews(sampleGradeReviews);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setAssignments([]);
                setIsLoading(false);
            }
        };

        fetchGradeReviewsData();
    }, []);


    const handleDiscussClick = (gradeReviewId) => {
        navigate(`/classroom/class-detail/${classId}/assignment/${assignmentId}/gradeReview/${gradeReviewId}`, { state: { isTeaching } });
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
                                    <Card key={review.id} sx={{ marginBottom: '16px' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                Student ID: {review.studentId}
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                Assignment ID: {review.assignmentId}
                                            </Typography>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="green">
                                                Status: {review.status.toUpperCase()}
                                            </Typography>
                                            <Button variant="outlined" color="primary" startIcon={<Icon>forum</Icon>} sx={{ mt: 2 }} onClick={() => handleDiscussClick(review.id)}>
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
                                    <Card key={review.id} sx={{ marginBottom: '16px' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                Student ID: {review.studentId}
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                Assignment ID: {review.assignmentId}
                                            </Typography>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="red">
                                                Status: {review.status.toUpperCase()}
                                            </Typography>
                                            <Button variant="outlined" color="primary" startIcon={<Icon>forum</Icon>} sx={{ mt: 2 }} onClick={() => handleDiscussClick(review.id)}>
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
