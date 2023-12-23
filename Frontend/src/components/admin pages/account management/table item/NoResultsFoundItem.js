import {ImageListItem, TableCell, Typography} from "@mui/material";
import React from "react";

export default function NoResultsFoundItem() {
  return (
    <TableCell colSpan={5}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ImageListItem sx={{ width: 250, height: 250 }}>
          <img src="/images/no_results_found.png" alt="No Results Found"/>
        </ImageListItem>
        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
          No Results Found
        </Typography>
      </div>
    </TableCell>
  );
}