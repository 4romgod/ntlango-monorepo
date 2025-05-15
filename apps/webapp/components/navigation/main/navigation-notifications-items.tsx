'use client';

import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import { MailOutline, NotificationsOutlined, ControlPointOutlined } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ROUTES } from '@/lib/constants';

type NotificationsMenuProps = {
  NotificationsMenuAnchorEl: HTMLElement | null;
  NotificationsMenuId: string;
  handleNotificationsMenuClose: () => void;
  isNotificationsMenuOpen: boolean;
};

export default function NotificationsMenu({
  NotificationsMenuAnchorEl,
  NotificationsMenuId,
  handleNotificationsMenuClose,
  isNotificationsMenuOpen,
}: NotificationsMenuProps) {
  return (
    <Menu
      anchorEl={NotificationsMenuAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={NotificationsMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationsMenuOpen}
      onClose={handleNotificationsMenuClose}
    >
      <MenuItem>
        <Link href={ROUTES.ACCOUNT.EVENTS.CREATE}>
          <IconButton size="large" aria-label="new mails" color="inherit">
            <ControlPointOutlined />
          </IconButton>
          Create Event
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href={ROUTES.ACCOUNT.MESSAGES}>
          <IconButton size="large" aria-label="new mails" color="inherit">
            <MailOutline />
          </IconButton>
          Messages
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href={ROUTES.ACCOUNT.NOTIFICATIONS}>
          <IconButton size="large" aria-label="new notifications" color="inherit">
            <NotificationsOutlined />
          </IconButton>
          Notifications
        </Link>
      </MenuItem>
    </Menu>
  );
}
