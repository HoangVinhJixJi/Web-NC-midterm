import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    ListItemButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddIcon from '@mui/icons-material/Add';

const AssignmentListTab = ({ classId, isTeaching }) => {
    const [isAddAssignmentDialogOpen, setIsAddAssignmentDialogOpen] = useState(false);
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentContent, setAssignmentContent] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Sample assignments data
    const sampleAssignments = [
        { _id: '1', assignmentName: 'Sample Assignment 1', assignmentContent: 'Sample content 1' },
        { _id: '2', assignmentName: 'Sample Assignment 2', assignmentContent: 'Sample content 2' },
        // Add more sample assignments as needed
    ];

    useEffect(() => {
        const fetchAssignmentData = async () => {
            try {
                // Simulate API call delay (remove this in the actual implementation)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Set the sample assignments data to the state
                setAssignments(sampleAssignments);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setAssignments([]);
                setIsLoading(false);
            }
        };

        fetchAssignmentData();
    }, []);

    const handleAddAssignmentClick = () => {
        setIsAddAssignmentDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsAddAssignmentDialogOpen(false);
        setMessage('');
    };

    const handleAddAssignmentConfirm = async () => {
        // Your existing code for adding assignments

        // Note: You may want to update the assignments state after successfully adding a new assignment.
        // For example, you can fetch the updated list of assignments from the server and set it to the state.
    };

    const handleAssignmentClick = (assignmentId) => {
        // Navigate to the detailed view of the assignment using the assignmentId
        navigate(`/classroom/class-detail/${classId}/assignment/${assignmentId}`, { state: { isTeaching } });
        // navigate(`assignment/${assignmentId}`, { state: { isTeaching } });
    };

    return (
        <>
            {assignments && isLoading ?
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
                :
                <div>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" gutterBottom>
                            Assignment List
                        </Typography>
                        {isTeaching &&
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
                    {assignments && <List>
                        {assignments.map((assignment) => (
                            <ListItem key={assignment._id}>
                                <ListItemButton onClick={isTeaching ? null : () => handleAssignmentClick(assignment._id)}>
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
                                        primary={assignment.assignmentName} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>}
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
                            <Typography variant="body2" color="error" mt={2}>
                                {message}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button onClick={handleAddAssignmentConfirm} color="primary">Create</Button>
                        </DialogActions>
                    </Dialog>
                </div>}
        </>
    );
};

export default AssignmentListTab;
