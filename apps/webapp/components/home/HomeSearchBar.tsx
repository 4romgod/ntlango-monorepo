import { Box, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function HomeSearchBar() {
  return (
    <Paper
      component="form"
      sx={{
        p: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 0,
        mb: 2,
      }}
      elevation={0}
    >
      <SearchIcon color="primary" sx={{ mr: 1 }} />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search events, friends, or categories"
        inputProps={{ 'aria-label': 'search events, friends, or categories' }}
      />
    </Paper>
  );
}
