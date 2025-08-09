import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Rating
} from '@mui/material';
import {
  LocationOn,
  Phone,
  NavigateNext,
  DirectionsCar,
  Person,
  CheckCircle,
  Message
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicles } from '../data/mockData';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const foundVehicle = vehicles.find(v => v.id === parseInt(id));
      setVehicle(foundVehicle);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return <VehicleDetailsSkeleton />;
  }

  if (!vehicle) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Vehicle not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/locations')}>
          Back to Locations
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ pt: 10, pb: 6 }}>
      <Container maxWidth="xl">
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/')}
            sx={{ textDecoration: 'none' }}
          >
            Home
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/locations')}
            sx={{ textDecoration: 'none' }}
          >
            Locations
          </Link>
          <Typography variant="body2" color="text.primary">
            {vehicle.vehicleName}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 4 }}>
              <CardMedia
                component="img"
                height="400"
                image={vehicle.image}
                alt={vehicle.vehicleName}
              />
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  About This Vehicle
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                  {vehicle.description}
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Features & Amenities
                </Typography>
                <List>
                  {vehicle.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {vehicle.vehicleName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body1" color="text.secondary">
                    Owner: {vehicle.ownerName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body1" color="text.secondary">
                    {vehicle.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={vehicle.rating} precision={0.1} readOnly />
                  <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>
                    {vehicle.rating} ({vehicle.reviewCount} reviews)
                  </Typography>
                </Box>
                <Chip
                  label={vehicle.availability}
                  color={vehicle.availability === 'Available' ? 'success' : 'warning'}
                  sx={{ mb: 3 }}
                />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Capacity
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {vehicle.capacity}
                  </Typography>
                </Box>

                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600, mb: 3 }}>
                  ${vehicle.pricePerDay}/day
                </Typography>
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Message />}
                  sx={{
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    py: 1.5,
                    mb: 2
                  }}
                >
                  Book Now
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Phone />}
                >
                  {vehicle.contact}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const VehicleDetailsSkeleton = () => (
  <Box sx={{ pt: 10, pb: 6 }}>
    <Container maxWidth="xl">
      <Skeleton variant="text" width={200} height={30} sx={{ mb: 3 }} />
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
              <Skeleton variant="text" width={100} height={30} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={40} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default VehicleDetailsPage;