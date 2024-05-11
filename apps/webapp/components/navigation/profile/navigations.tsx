'use client';

import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { NavLinksProps } from '@/components/navigation/profile/navigation-links';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SyntheticEvent, useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ProfileSideNav({ links }: { links: NavLinksProps }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { navTitle, navLinks } = links;

  const handleTabChange = (event: SyntheticEvent<Element, Event>, tabIndex: number) => {
    setCurrentTabIndex(tabIndex);
  };

  return (
    <Box component="div">
      <Paper elevation={2} sx={{ borderRadius: 2, backgroundColor: '#2196f3', padding: 2 }}>
        <Typography variant="h4" fontWeight="bold" align="center">
          {navTitle}
        </Typography>
      </Paper>
      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
        variant={isSmallScreen ? 'scrollable' : 'standard'}
        scrollButtons={isSmallScreen ? true : false}
        allowScrollButtonsMobile={isSmallScreen ? true : false}
        orientation={isSmallScreen ? 'horizontal' : 'vertical'}
      >
        {navLinks.map(({ name, href }) => {
          return <Tab label={name} key={name} />;
        })}
      </Tabs>
    </Box>
  );
}
