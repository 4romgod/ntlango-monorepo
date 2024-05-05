import { UserGroupIcon, HomeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

const links = {
  navTitle: 'Settings',
  navLinks: [
    {
      name: 'Edit Profile',
      href: '/account',
      // icon: HomeIcon,
    },
    {
      name: 'Personal Information',
      href: '/account/personal',
      // icon: UserGroupIcon,
    },
    {
      name: 'Payments',
      href: '/account/payments',
      // icon: DocumentDuplicateIcon,
    },
  ],
};

export default links;
