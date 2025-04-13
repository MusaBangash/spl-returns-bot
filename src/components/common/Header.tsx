import React, { useState } from 'react';
import { 
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Divider,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };
  
  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };
  
  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };
  
  const handleNotificationsMenuClose = () => {
    setNotificationsMenuAnchor(null);
  };
  
  const handleLogout = () => {
    logout();
    handleAccountMenuClose();
    navigate('/login');
  };
  
  const handleProfileClick = () => {
    handleAccountMenuClose();
    navigate('/profile');
  };
  
  const handleNewChatClick = () => {
    navigate('/chat');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          SPL Returns Bot
        </Typography>
        
        <Button 
          color="inherit" 
          onClick={handleNewChatClick}
          sx={{ mr: 2 }}
        >
          New Chat
        </Button>
        
        <Box sx={{ display: 'flex' }}>
          <IconButton
            size="large"
            aria-label="show notifications"
            aria-controls="menu-notifications"
            aria-haspopup="true"
            onClick={handleNotificationsMenuOpen}
            color="inherit"
          >
            <NotificationsIcon />
          </IconButton>
          
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-account"
            aria-haspopup="true"
            onClick={handleAccountMenuOpen}
            color="inherit"
          >
            {authState.user?.name ? (
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {authState.user.name.charAt(0)}
              </Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </Box>
        
        {/* Account Menu */}
        <Menu
          id="menu-account"
          anchorEl={accountMenuAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(accountMenuAnchor)}
          onClose={handleAccountMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleAccountMenuClose}>My Returns</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        
        {/* Notifications Menu */}
        <Menu
          id="menu-notifications"
          anchorEl={notificationsMenuAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(notificationsMenuAnchor)}
          onClose={handleNotificationsMenuClose}
        >
          <MenuItem onClick={handleNotificationsMenuClose}>
            Your return SAPC-2023-001 has been approved
          </MenuItem>
          <MenuItem onClick={handleNotificationsMenuClose}>
            Your replacement item has been shipped
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationsMenuClose}>
            View all notifications
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 