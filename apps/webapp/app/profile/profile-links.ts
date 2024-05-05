import { UserGroupIcon, HomeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

const links = {
  navTitle: 'Profile',
  navLinks: [
    {
      name: 'Profile',
      href: '/profile',
      // icon: HomeIcon,
    },
    {
      name: 'Events',
      href: '/profile/events',
      // icon: UserGroupIcon,
    },
    {
      name: 'Interests',
      href: '/profile/interests',
      // icon: DocumentDuplicateIcon,
    },
    {
      name: 'Messages',
      href: '/profile/messages',
    },
    {
      name: 'Notifications',
      href: '/profile/notifications',
    },
    {
      name: 'Settings',
      href: '/account',
    },
  ],
};

export default links;
