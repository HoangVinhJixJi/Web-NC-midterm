import {Container, Pagination} from "@mui/material";
import React from "react";

export default function AdminPagination({ count, onPageChange }) {
  return (
    <Container
      sx={{
        display: 'flex', flexDirection: 'row', minHeight: '8vh',
        justifyContent: 'right', alignItems: 'center' }}
    >
      <Pagination
        count={count}
        color="primary" shape="rounded"
        showFirstButton showLastButton
        onChange={(event, value) => onPageChange(value)}
      />
    </Container>
  );
}