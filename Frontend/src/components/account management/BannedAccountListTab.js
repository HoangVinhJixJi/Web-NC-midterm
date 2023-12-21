import {Container, Grid} from "@mui/material";
import React from "react";

export default function BannedAccountListTab() {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
        Hello
      </Grid>
    </Container>
  );
}