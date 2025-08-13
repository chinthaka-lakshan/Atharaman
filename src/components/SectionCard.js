import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { LocationOn, Person, Store, Hotel, DirectionsCar, AttachMoney } from '@mui/icons-material';

const SectionCard = ({ type, data, onClick }) => {
  const getIcon = () => {
    switch (type) {
      case 'location':
        return <LocationOn sx={{ fontSize: '1rem' }} />;
      case 'guide':
        return <Person sx={{ fontSize: '1rem' }} />;
      case 'shop':
        return <Store sx={{ fontSize: '1rem' }} />;
      case 'hotel':
        return <Hotel sx={{ fontSize: '1rem' }} />;
      case 'vehicle':
        return <DirectionsCar sx={{ fontSize: '1rem' }} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'location':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {data.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {data.location}
              </Typography>
            </Box>
          </>
        );
      
      case 'guide':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {data.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {data.location}
              </Typography>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={`${data.rating} ⭐`}
                size="small"
                sx={{ bgcolor: 'primary.light', color: 'white' }}
              />
            </Box>
          </>
        );
      
      case 'shop':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {data.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {data.location}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {data.category}
            </Typography>
          </>
        );
      
      case 'hotel':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {data.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {data.location}
              </Typography>
            </Box>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`${data.rating} ⭐`}
                size="small"
                sx={{ bgcolor: 'secondary.light', color: 'white' }}
              />
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                From ${data.pricePerNight}/night
              </Typography>
            </Box>
          </>
        );
      
      case 'vehicle':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {data.vehicleName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Owner: {data.ownerName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney sx={{ fontSize: '1rem', color: 'secondary.main' }} />
              <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                ${data.pricePerDay}/day
              </Typography>
            </Box>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={data.image}
        alt={data.name || data.vehicleName}
        sx={{
          objectFit: 'cover',
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default SectionCard;