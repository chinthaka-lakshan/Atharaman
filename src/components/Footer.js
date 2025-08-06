import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  Phone,
  Email,
  LocationOn,
  Terrain,
} from '@mui/icons-material';

const Footer = () => {
  const navigationLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Locations', href: '#locations' },
    { label: 'Guides', href: '#guides' },
    { label: 'Shops', href: '#shops' },
    { label: 'Hotels', href: '#hotels' },
    { label: 'Vehicles', href: '#vehicles' },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: '#', label: 'Facebook' },
    { icon: <Instagram />, href: '#', label: 'Instagram' },
    { icon: <Twitter />, href: '#', label: 'Twitter' },
    { icon: <YouTube />, href: '#', label: 'YouTube' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1A1A1A',
        color: 'white',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
            <Typography variant="body2" sx={{ mb: 3, color: 'grey.400', lineHeight: 1.8 }}>
              Your ultimate companion for exploring Sri Lanka's breathtaking camping 
              destinations. Discover hidden gems, connect with expert guides, and create 
              unforgettable memories in nature's paradise.
            </Typography>
            
            {/* Social Media Icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  sx={{
                    color: 'grey.400',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Navigation Links */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {navigationLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['Camping Locations', 'Expert Guides', 'Equipment Rental', 'Accommodation', 'Transportation', 'Adventure Tours'].map((service, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'secondary.main',
                      transform: 'translateX(5px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {service}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="grey.400">
                  123 Adventure Street,<br />
                  Colombo 07, Sri Lanka
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="grey.400">
                  +94 11 234 5678
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="grey.400">
                  info@atharaman.lk
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'grey.800' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.500">
            © 2024 Atharaman. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" sx={{ color: 'grey.500', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Privacy Policy
            </Link>
            <Link href="#" sx={{ color: 'grey.500', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Terms & Conditions
            </Link>
            <Link href="#" sx={{ color: 'grey.500', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;