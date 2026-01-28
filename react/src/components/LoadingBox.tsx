import React from 'react';
import {Box, type BoxProps, CircularProgress} from "@mui/material";


interface Props extends BoxProps {
  size?: number,
}

function LoadingBox({ size, ...props }: Props) {
  return (
    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }} {...props}>
      <CircularProgress size={size ?? 24}/>
    </Box>
  );
}

export default LoadingBox;