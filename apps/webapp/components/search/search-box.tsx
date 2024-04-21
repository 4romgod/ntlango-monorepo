'use client';

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { SxProps, Theme } from '@mui/material';

export default function SearchBar({ itemList, sx }: { itemList?: Array<string>; sx?: SxProps<Theme> }) {
  return (
    <Stack spacing={2} sx={{ width: 300, ...sx }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={itemList ?? []}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </Stack>
  );
}
