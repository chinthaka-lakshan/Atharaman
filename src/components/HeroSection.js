import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Explore } from '@mui/icons-material';

const HeroSection = () => {
  const scrollToLocations = () => {
    document.getElementById('locations').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        height: '100vh',
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            animation: 'fadeInUp 1s ease-out',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              mb: 3,
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
            }}
          >
            Discover Sri Lanka's
            <br />
            Hidden Adventures
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: 400,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Explore breathtaking camping locations, connect with expert guides,
            and create unforgettable memories in nature's paradise
          </Typography>
          
          <Button
            onClick={scrollToLocations}
            variant="contained"
            size="large"
            startIcon={<Explore />}
            sx={{
              background: 'linear-gradient(45deg, #FF6F00, #FF8F00)',
              color: 'white',
              px: 4,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: '0 8px 30px rgba(255, 111, 0, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #E65100, #FF6F00)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 40px rgba(255, 111, 0, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Explore More
          </Button>
        </Box>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite',
        }}
      >
        <Box
          sx={{
            width: 2,
            height: 40,
            bgcolor: 'white',
            borderRadius: 1,
            opacity: 0.7,
          }}
        />
      </Box>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
      `}</style>
    </Box>
  );
};

export default HeroSection;