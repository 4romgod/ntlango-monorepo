'use client';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider, ListItemIcon } from '@mui/material';
import { AccountCircle, Logout, Settings } from '@mui/icons-material';

type ProfilesMenuProps = {
  ProfilesMenuAnchorEl: HTMLElement | null;
  ProfilesMenuId: string;
  handleProfilesMenuClose: () => void;
  isProfilesMenuOpen: boolean;
};

export default function ProfilesMenu({
  ProfilesMenuAnchorEl,
  ProfilesMenuId,
  handleProfilesMenuClose,
  isProfilesMenuOpen,
}: ProfilesMenuProps) {
  return (
    <Menu
      anchorEl={ProfilesMenuAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={ProfilesMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isProfilesMenuOpen}
      onClose={handleProfilesMenuClose}
    >
      <MenuItem onClick={handleProfilesMenuClose}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleProfilesMenuClose}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={handleProfilesMenuClose}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
}
