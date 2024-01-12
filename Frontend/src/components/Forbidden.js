import {Container, ImageListItem, Paper, Typography} from '@mui/material';
import React from 'react';

export default function Forbidden() {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          You do not have permission to access this page!
        </Typography>
        <ImageListItem sx={{ width: 400, height: 400 }}>
          <img src="/images/forbidden.png" alt="Forbidden image"/>
        </ImageListItem>
      </Paper>
    </Container>
  );
}