import React from 'react';
import { Box, Tab, Tabs, Typography, Grid, Paper } from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';


const TeachingTab = ({ onClassClick}) => {
    const classList = [
        { id: 11, name: 'Lớp học 11', description: 'Teaching Class' },
        { id: 12, name: 'Lớp học 12', description: 'Teaching Class' },
        { id: 13, name: 'Lớp học 13', description: 'Teaching Class' },
        { id: 14, name: 'Lớp học 14', description: 'Teaching Class' },
    ];
  return (
    <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
    {classList.map((classItem) => (
      <Grid item key={classItem.id} xs={12} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: '16px', height: '100%', position: 'relative' }} onClick={() => onClassClick(classItem.id)}>
       
          <Diversity3Icon fontSize="large" style={{ marginBottom: '8px' }}/>

          {/* Nội dung thông tin */}
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {classItem.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {classItem.description}
            </Typography>
            
          </div>
        </Paper>
      </Grid>
    ))}
  </Grid>
  );
};

export default TeachingTab;

