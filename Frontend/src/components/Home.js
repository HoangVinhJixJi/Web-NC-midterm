import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useAuth as useAuthContext } from '../api/AuthContext';

function Home() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#ffffff' });
  const [editIndex, setEditIndex] = useState(null);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const { isLoggedIn } = useAuthContext();

  const navigate = useNavigate();
  
  useEffect(() => {
    // Nếu isLoggedIn là false, chuyển hướng đến trang đăng nhập
    if (!isLoggedIn) {
      navigate('/');
    }else{
      setIsLoading(false);
    }
  }, [isLoggedIn, navigate]);

  const handleAddNote = () => {
    setNotes([...notes, { ...newNote, timestamp: new Date() }]);
    setNewNote({ title: '', content: '', color: '#ffffff' });
    setColorPickerAnchor(null);
  };

  const handleEditNote = (index) => () => {
    setEditIndex(index);
    setNewNote({ ...notes[index] });
    setColorPickerAnchor(null);
  };

  const handleSaveNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[editIndex] = { ...newNote, timestamp: new Date() };
    setNotes(updatedNotes);
    setNewNote({ title: '', content: '', color: '#ffffff' });
    setEditIndex(null);
    setColorPickerAnchor(null);
  };

  const handleDeleteNote = (index) => () => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
    setColorPickerAnchor(null);
  };

  const handleColorPickerClick = (event) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  const handleColorSelect = (color) => {
    setNewNote({ ...newNote, color });
    setColorPickerAnchor(null);
  };

  return (
    <>
    { isLoading ?
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
      :
    <div>
      <Typography variant="h3" gutterBottom>
        Welcome to the Home Page
      </Typography>
      <Typography variant="body1" paragraph>
        Congratulations! You have successfully signed in. Explore the features and make the most out of your experience.
      </Typography>
      <Typography variant="body1" paragraph>
        Explore various functionalities within the classroom platform:
      </Typography>
      <ul>
        <li>
          <Typography variant="body1">
            Update your profile information.
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Discover and utilize exciting features.
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Connect with fellow users in the classroom community.
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Customize your preferences to personalize the classroom experience.
          </Typography>
        </li>
      </ul>
      <Button variant="contained" color="primary" component={Link} to="/classroom" style={{ marginTop: '20px' }}>
        Visit Classroom
      </Button>

      {/* Ghi chú */}
      <Typography variant="h4" mt={4} mb={2}>
        Your Notes
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, minHeight: '100%' }}>
            <TextField
              fullWidth
              label="Note Title"
              variant="outlined"
              margin="normal"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Note Content"
              variant="outlined"
              margin="normal"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              sx={{ overflowWrap: 'break-word' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleColorPickerClick}
              startIcon={<ColorLensIcon />}
              sx={{ mt: 2, mr: 2 }}
            >
              Choose Color
            </Button>
            <Menu
              anchorEl={colorPickerAnchor}
              open={Boolean(colorPickerAnchor)}
              onClose={handleColorPickerClose}
            >
              <MenuItem onClick={() => handleColorSelect('#ffffff')}>White</MenuItem>
              <MenuItem onClick={() => handleColorSelect('#ffcccb')}>Light Red</MenuItem>
              <MenuItem onClick={() => handleColorSelect('#c1ffc1')}>Light Green</MenuItem>
              {/* Thêm các màu khác tại đây */}
            </Menu>
            {editIndex !== null ? (
              <Button variant="contained" color="primary" onClick={handleSaveNote} sx={{ mt: 2 }}>
                Save Note
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleAddNote} sx={{ mt: 2 }}>
                Add Note
              </Button>
            )}
          </Paper>
        </Grid>
        {notes.map((note, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={3} sx={{ p: 3, position: 'relative', height: '100%', backgroundColor: note.color, minHeight: '100%' }}>
              <Typography variant="h6">{note.title}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {note.timestamp.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, mb: 2, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{note.content}</Typography>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px'}}>
                <IconButton color="primary" aria-label="edit" onClick={handleEditNote(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="primary" aria-label="delete" onClick={handleDeleteNote(index)} sx={{ ml: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>}
    </>
  );
}

export default Home;
