import {ImageListItem, TableCell, Typography} from "@mui/material";
import React from "react";

export default function LoadingDataItem({ colSpan }) {
  return (
    <TableCell colSpan={colSpan}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ImageListItem sx={{ width: 250, height: 250 }}>
          <img src="/images/loading.png" alt="Waiting for loading data"/>
        </ImageListItem>
        <Typography variant="body2" gutterBottom style={{ fontWeight: 'bold' }}>
          Waiting for loading data ...
        </Typography>
      </div>
    </TableCell>
  );
}