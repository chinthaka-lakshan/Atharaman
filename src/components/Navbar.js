import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
} from '@mui/material';
import {
  Person,
  Settings,
  PrivacyTip,
  Description,
  Logout,
  Terrain,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AuthModals from './AuthModals';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLoginClick = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileClose();
  };

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Locations', href: '#locations' },
    { label: 'Guides', href: '#guides' },
    { label: 'Shops', href: '#shops' },
    { label: 'Hotels', href: '#hotels' },
    { label: 'Vehicles', href: '#vehicles' },
  ];

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Terrain sx={{ fontSize: '2rem', color: 'primary.main' }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2E7D32, #FF6F00)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Atharaman
              </Typography>
            </Box>

            {/* Navigation Items */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Auth Section */}
            <Box>
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    onClick={handleProfileClick}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.primary',
                      textTransform: 'none',
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '0.9rem',
                      }}
                    >
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <MenuItem onClick={handleProfileClose}>
                      <ListItemIcon>
                        <Person fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Your Profile</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleProfileClose}>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Settings</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleProfileClose}>
                      <ListItemIcon>
                        <PrivacyTip fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Privacy Policy</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleProfileClose}>
                      <ListItemIcon>
                        <Description fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Terms & Conditions</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    color: 'white',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <AuthModals
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Navbar;