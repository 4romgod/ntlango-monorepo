import CustomTabs, { CustomTabsProps } from '@/components/tabs/custom-tabs';
import { Person, PersonOutlined, ManageAccounts, Payment, Interests, Event, PermMedia } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Ntlango',
    template: 'Ntlango',
  },
  icons: {
    icon: '/logo-img.png',
    shortcut: '/logo-img.png',
    apple: '/logo-img.png',
  },
};

const tabsProps: CustomTabsProps = {
  tabsTitle: '',
  tabs: [
    {
      name: 'Edit Profile',
      content: <Typography variant='body1'>Edit Profile</Typography>,
      icon: <PersonOutlined fontSize="small" />,
    },
    {
      name: 'Personal',
      content: <Typography variant='body1'>Personal</Typography>,
      icon: <Person fontSize="small" />,
    },
    {
      name: 'Interests',
      content: <Typography variant='body1'>Interests</Typography>,
      icon: <Interests fontSize="small" />,
    },
    {
      name: 'Events',
      content: <Typography variant='body1'>Events</Typography>,
      icon: <Event fontSize="small" />,
    },
    {
      name: 'Account',
      content: <Typography variant='body1'>Account</Typography>,
      icon: <ManageAccounts fontSize="small" />,
    },
    {
      name: 'Payments',
      content: <Typography variant='body1'>Payments</Typography>,
      icon: <Payment fontSize="small" />,
    },
    {
      name: 'Social Media',
      content: <Typography variant='body1'>Social Media</Typography>,
      icon: <PermMedia fontSize="small" />,
    },
  ],
};

export default async function Page() {
  return (
    <main>
      <CustomTabs tabsProps={tabsProps} />
    </main>
  );
}
