import {Container, Pagination} from "@mui/material";
import React, {useMemo} from 'react';

export default function AdminPagination({ count, curPage, onPageChange }) {
  const paginationKey = useMemo(() => curPage, [curPage]);

  return (
    <Container
      key={paginationKey}
      sx={{
        display: 'flex', flexDirection: 'row', minHeight: '8vh',
        justifyContent: 'right', alignItems: 'center' }}
    >
      <Pagination
        count={count}
        page={curPage}
        color="primary" shape="rounded"
        showFirstButton showLastButton
        onChange={(event, value) => onPageChange(value)}
      />
    </Container>
  );
}