import { Box, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export default function CustomContainer({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
    return (
        <Box
            component="div"
            sx={{
                ...sx,
                maxWidth: { xs: '95%', sm: '90%', md: '90%', lg: '80%' },
                mx: 'auto',
            }}
        >
            {children}
        </Box>
    )
};
