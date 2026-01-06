import { ReactNode } from 'react';
import { Box, Paper } from '@mui/material';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
  id: string;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, id } = props;

  return (
    <Box role="tabpanel" hidden={value !== index} id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`}>
      {value === index && (
        <Paper
          elevation={0}
          sx={{
            borderColor: 'divider',
            p: 4,
            minHeight: 400,
          }}
        >
          {children}
        </Paper>
      )}
    </Box>
  );
}
