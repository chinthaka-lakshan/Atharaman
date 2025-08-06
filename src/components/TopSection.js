import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import SectionCard from './SectionCard';

const TopSection = ({ title, data, type, onSeeMore, onCardClick }) => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #2E7D32, #FF6F00)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Discover the best {title.toLowerCase()} curated just for you
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {data.slice(0, 3).map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <SectionCard
                type={type}
                data={item}
                onClick={() => onCardClick(item)}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            onClick={onSeeMore}
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            See More {title}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TopSection;