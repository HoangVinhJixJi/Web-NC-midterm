import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Grid,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api, { setAuthToken } from '../../api/api';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';
import { useNavigate } from 'react-router-dom';


const DragHandle = sortableHandle(() => <span className='Showcase__style__handle'>::</span>);

const SortableTableRow = sortableElement(({ grade, isTeaching, handleRemoveGrade, handleUpdateGrade }) => (
  <TableRow key={grade._id}>
    <TableCell>
      {isTeaching && <DragHandle />}
      {grade.name}
    </TableCell>
    <TableCell>{grade.scale}%</TableCell>
    {isTeaching && (
      <TableCell>
        <Button color="error" onClick={() => handleRemoveGrade(grade._id)}>
          Remove
        </Button>
        <Button
          color="primary"
          onClick={() => handleUpdateGrade(grade._id, grade.name, grade.scale)}
        >
          Update
        </Button>
      </TableCell>
    )}
  </TableRow>
));

const SortableTableBody = sortableContainer(({ children }) => (
  <TableBody>{children}</TableBody>
));

const GradeStructureTab = ({ classId, isTeaching }) => {
  const [gradeStructure, setGradeStructure] = useState([]);
  const [isAddGradeDialogOpen, setIsAddGradeDialogOpen] = useState(false);
  const [newGradeName, setNewGradeName] = useState('');
  const [newGradeScale, setNewGradeScale] = useState('');
  const [message, setMessage] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [gradeIdToRemove, setGradeIdToRemove] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGradeStructure = async () => {
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
        const response = await api.get(`/gradeStructures/${classId}`);
        setGradeStructure(response.data);
      } catch (error) {
        setMessage('Error fetching grade structure.');
        console.error('Error fetching grade structure:', error);
      }
    };

    fetchGradeStructure();
  }, [classId]);

  const handleAddGradeConfirm = async () => {
    if (!newGradeName.trim()) {
      setMessage('Grade Name is required!');
      return;
    }

    const isDuplicateName = gradeStructure.some(
      (grade) => grade.name.trim() === newGradeName.trim() && grade._id !== selectedGradeId
    );
    if (isDuplicateName) {
      setMessage('Grade Name must be unique!');
      return;
    }

    const scaleValue = parseFloat(newGradeScale);
    if (isNaN(scaleValue) || scaleValue <= 0 || scaleValue > 100) {
      setMessage('Invalid scale value!');
      return;
    }

    let updatedTotalScale;
    if (selectedGradeId) {
      const prevScale = gradeStructure.find((grade) => grade._id === selectedGradeId)?.scale || 0;
      updatedTotalScale = gradeStructure.reduce((acc, grade) => acc + parseFloat(grade.scale), 0);
      updatedTotalScale += scaleValue - parseFloat(prevScale);
    } else {
      updatedTotalScale = gradeStructure.reduce((acc, grade) => acc + parseFloat(grade.scale), 0);
      updatedTotalScale += scaleValue;
    }

    if (updatedTotalScale > 120) {
      setMessage('Total scale cannot exceed 120!');
      return;
    }

    try {
      const userData = {
        name: newGradeName.trim(),
        scale: scaleValue,
      };

      if (selectedGradeId) {
        await api.post(`/gradeStructures/update/${selectedGradeId}`, userData);
        const updatedStructure = gradeStructure.map((grade) =>
          grade._id === selectedGradeId ? { ...grade, ...userData } : grade
        );
        setGradeStructure(updatedStructure);
      } else {
        const response = await api.post(`/gradeStructures/add/${classId}`, userData);
        setGradeStructure((prevStructure) => [...prevStructure, response.data]);
      }

      handleCloseDialog();
    } catch (error) {
      setMessage('Error adding/updating grade composition.');
      console.error('Error adding/updating grade composition:', error);
    }
  };

  const calculateTotalScale = () => {
    const totalScale = gradeStructure.reduce((acc, grade) => {
      const numericValue = parseInt(grade.scale);
      return acc + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);

    return `${totalScale}%`;
  };
  
  // Hàm mở hộp thoại xác nhận
  const openRemoveDialog = (gradeId) => {
    setGradeIdToRemove(gradeId);
    setIsRemoveDialogOpen(true);
  };

  // Hàm đóng hộp thoại xác nhận
  const closeRemoveDialog = () => {
    setGradeIdToRemove(null);
    setIsRemoveDialogOpen(false);
  };

  // Hàm xác nhận xóa
  const handleConfirmRemove = async () => {
    try {
      await api.delete(`/gradeStructures/remove/${gradeIdToRemove}`);
      setGradeStructure((prevStructure) =>
        prevStructure.filter((grade) => grade._id !== gradeIdToRemove)
      );
      closeRemoveDialog();
    } catch (error) {
      setMessage('Error removing grade composition.');
      console.error('Error removing grade composition:', error);
    }
  };

  const handleUpdateGrade = (gradeId, gradeName, gradeScale) => {
    setNewGradeName(gradeName);
    setNewGradeScale(gradeScale);
    setSelectedGradeId(gradeId);
    setIsAddGradeDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddGradeDialogOpen(false);
    setNewGradeName('');
    setNewGradeScale('');
    setMessage('');
    setSelectedGradeId(null);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setGradeStructure((prevStructure) =>
      arrayMove(prevStructure, oldIndex, newIndex)
    );
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Grade Structure
        </Typography>
        {isTeaching && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsAddGradeDialogOpen(true)}
            >
              Add
            </Button>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ margin: '16px 0' }} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Grade Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Grade Scale</TableCell>
              {isTeaching && (
                <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <SortableTableBody onSortEnd={onSortEnd} useDragHandle>
            {gradeStructure.map((grade, index) => (
              <SortableTableRow
                key={grade._id}
                index={index}
                grade={grade}
                isTeaching={isTeaching}
                handleRemoveGrade={openRemoveDialog}
                handleUpdateGrade={handleUpdateGrade}
              />
            ))}
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>
                {calculateTotalScale()}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </SortableTableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={isRemoveDialogOpen} onClose={closeRemoveDialog}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this grade composition?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRemoveDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddGradeDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedGradeId ? 'Update Grade Composition' : 'Add Grade Composition'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Grade Name"
            fullWidth
            value={newGradeName}
            onChange={(e) => setNewGradeName(e.target.value)}
            required
            style={{ marginTop: '16px' }}
          />
          <TextField
            label="Grade Scale"
            fullWidth
            value={newGradeScale}
            onChange={(e) => setNewGradeScale(e.target.value)}
            required
            style={{ marginTop: '16px' }}
          />
          <Typography variant="body2" color="error" mt={2}>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddGradeConfirm} color="primary">
            {selectedGradeId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GradeStructureTab;