import { Typography } from '@mui/material';
import Link from 'next/link';

export default function Logo() {
  return (
    <Typography
      variant="h5"
      noWrap
      color={'secondary'}
      sx={{
        mx: 2,
        display: { md: 'flex' },
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        textDecoration: 'none',
        textAlign: 'center', // Align text to center
      }}
    >
      <Link href={'/'} style={{ width: '100%' }}>
        {'ntlango'}
      </Link>
    </Typography>
  );
}
