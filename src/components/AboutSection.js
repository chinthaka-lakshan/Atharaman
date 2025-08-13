import React from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { Explore, Group, Security, Support } from '@mui/icons-material';

const AboutSection = () => {
  const features = [
    {
      icon: <Explore sx={{ fontSize: '3rem', color: 'primary.main' }} />,
      title: 'Discover Hidden Gems',
      description: 'Explore Sri Lanka\'s most beautiful and secluded camping locations'
    },
    {
      icon: <Group sx={{ fontSize: '3rem', color: 'secondary.main' }} />,
      title: 'Expert Guides',
      description: 'Connect with experienced local guides who know every trail'
    },
    {
      icon: <Security sx={{ fontSize: '3rem', color: 'primary.main' }} />,
      title: 'Safe & Secure',
      description: 'All our guides and locations are verified for your safety'
    },
    {
      icon: <Support sx={{ fontSize: '3rem', color: 'secondary.main' }} />,
      title: '24/7 Support',
      description: 'Get help whenever you need it during your adventure'
    }
  ];

  return (
    <Box id="about" sx={{ py: 10, bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="About Atharaman"
              sx={{
                width: '100%',
                height: '500px',
                objectFit: 'cover',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(45deg, #2E7D32, #FF6F00)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About Atharaman
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
              Atharaman is your gateway to Sri Lanka's most incredible outdoor adventures. 
              We connect adventure seekers with the island's hidden camping gems, experienced 
              guides, quality equipment, and comfortable accommodations.
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
              Whether you're a seasoned camper or just starting your outdoor journey, 
              we provide everything you need for a safe, memorable, and authentic Sri Lankan 
              adventure experience.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    {feature.icon}
                    <Typography variant="h6" sx={{ fontWeight: 600, my: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
              }}
            >
              Start Your Adventure
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;