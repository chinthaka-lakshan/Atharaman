import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Button,
  Breadcrumbs,
  Link,
  Divider,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  Skeleton,
  Paper
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Star,
  NavigateNext,
  Close,
  WbSunny,
  Cloud,
  Grain,
  Air,
  Thermostat,
  Water,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { locations, guides, shops, vehicles, hotels, weatherIcons } from '../data/mockData';

const LocationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [weatherView, setWeatherView] = useState('current'); // 'current', 'forecast', 'historical'

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundLocation = locations.find(loc => loc.id === parseInt(id));
      setLocation(foundLocation);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return <LocationDetailsSkeleton />;
  }

  if (!location) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Location not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/locations')}>
          Back to Locations
        </Button>
      </Container>
    );
  }

  const handleImageNavigation = (direction) => {
    if (direction === 'next') {
      setSelectedImageIndex((prev) => 
        prev === location.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex((prev) => 
        prev === 0 ? location.images.length - 1 : prev - 1
      );
    }
  };

  const WeatherWidget = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Weather Information
        </Typography>
        
        {/* Weather Navigation */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            variant={weatherView === 'current' ? 'contained' : 'outlined'}
            onClick={() => setWeatherView('current')}
            size="small"
          >
            Current
          </Button>
          <Button
            variant={weatherView === 'forecast' ? 'contained' : 'outlined'}
            onClick={() => setWeatherView('forecast')}
            size="small"
          >
            7-Day Forecast
          </Button>
          <Button
            variant={weatherView === 'historical' ? 'contained' : 'outlined'}
            onClick={() => setWeatherView('historical')}
            size="small"
          >
            Past 7 Days
          </Button>
        </Box>

        {/* Current Weather */}
        {weatherView === 'current' && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ mb: 1 }}>
              {weatherIcons[location.weather.current.icon]}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {location.weather.current.temperature}°C
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
              {location.weather.current.condition}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Water color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Humidity
                  </Typography>
                  <Typography variant="h6">
                    {location.weather.current.humidity}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Air color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Wind Speed
                  </Typography>
                  <Typography variant="h6">
                    {location.weather.current.windSpeed} km/h
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Thermostat color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Feels Like
                  </Typography>
                  <Typography variant="h6">
                    {location.weather.current.temperature + 2}°C
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Forecast Weather */}
        {weatherView === 'forecast' && (
          <Grid container spacing={2}>
            {location.weather.forecast.map((day, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    {day.day}
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {weatherIcons[day.icon]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {day.condition}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {day.high}°
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {day.low}°
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Historical Weather */}
        {weatherView === 'historical' && (
          <Grid container spacing={2}>
            {location.weather.historical.map((day, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    {day.day}
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {weatherIcons[day.icon]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {day.condition}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {day.high}°
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {day.low}°
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  const RecommendationSection = ({ title, items, type }) => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {items.slice(0, 3).map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              onClick={() => navigate(`/${type}/${item.id}`)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name || item.vehicleName}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.name || item.vehicleName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {item.location}
                  </Typography>
                </Box>
                {item.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={item.rating} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {item.rating}
                    </Typography>
                  </Box>
                )}
                {item.pricePerDay && (
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                    ${item.pricePerDay}/day
                  </Typography>
                )}
                {item.pricePerNight && (
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                    ${item.pricePerNight}/night
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ pt: 10, pb: 6 }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
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
            {location.name}
          </Typography>
        </Breadcrumbs>

        {/* Hero Section */}
        <Box sx={{ mb: 6 }}>
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
            {location.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="h6" color="text.secondary">
                {location.location}
              </Typography>
            </Box>
            <Chip
              label={location.category}
              sx={{
                bgcolor: 'primary.light',
                color: 'white',
                fontWeight: 600
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={location.rating} precision={0.1} readOnly />
              <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>
                {location.rating} ({location.reviewCount} reviews)
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={6}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* Image Gallery */}
            <Card sx={{ mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={location.images[selectedImageIndex]}
                  alt={location.name}
                  onClick={() => setImageDialogOpen(true)}
                  sx={{ cursor: 'pointer' }}
                />
                
                {/* Image Navigation */}
                {location.images.length > 1 && (
                  <>
                    <IconButton
                      onClick={() => handleImageNavigation('prev')}
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      onClick={() => handleImageNavigation('next')}
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}
                
                {/* Image Indicators */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1
                  }}
                >
                  {location.images.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: selectedImageIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Card>

            {/* Description */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  About This Location
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                  {location.shortDescription}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  {location.longDescription}
                </Typography>
              </CardContent>
            </Card>

            {/* Weather Widget */}
            <WeatherWidget />

            {/* Map Placeholder */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Location Map
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor: 'grey.300'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <LocationOn sx={{ fontSize: '3rem', color: 'grey.400', mb: 1 }} />
                    <Typography variant="h6" color="grey.500">
                      Interactive Map
                    </Typography>
                    <Typography variant="body2" color="grey.400">
                      Lat: {location.coordinates.lat}, Lng: {location.coordinates.lng}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Contact Information */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Contact Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {location.address}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {location.contact}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Distance
                  </Typography>
                  <Typography variant="body1">
                    {location.distance}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Phone />}
                  sx={{
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    py: 1.5
                  }}
                >
                  Contact Now
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Quick Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Star sx={{ color: 'secondary.main', fontSize: '2rem', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {location.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rating
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {location.reviewCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reviews
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recommendations */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #2E7D32, #FF6F00)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Recommended for You
          </Typography>

          <RecommendationSection
            title="Suggested Guides"
            items={guides}
            type="guide"
          />

          <RecommendationSection
            title="Suggested Shops"
            items={shops}
            type="shop"
          />

          <RecommendationSection
            title="Suggested Vehicles"
            items={vehicles}
            type="vehicle"
          />

          <RecommendationSection
            title="Suggested Hotels"
            items={hotels}
            type="hotel"
          />
        </Box>

        {/* Image Dialog */}
        <Dialog
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={() => setImageDialogOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                zIndex: 1,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
            >
              <Close />
            </IconButton>
            <img
              src={location.images[selectedImageIndex]}
              alt={location.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

const LocationDetailsSkeleton = () => (
  <Box sx={{ pt: 10, pb: 6 }}>
    <Container maxWidth="xl">
      <Skeleton variant="text" width={200} height={30} sx={{ mb: 3 }} />
      <Skeleton variant="text" width={400} height={60} sx={{ mb: 2 }} />
      <Skeleton variant="text" width={300} height={30} sx={{ mb: 6 }} />
      
      <Grid container spacing={6}>
        <Grid item xs={12} lg={8}>
          <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={200} sx={{ mb: 4, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={300} sx={{ mb: 4, borderRadius: 2 }} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Skeleton variant="rectangular" height={250} sx={{ mb: 4, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default LocationDetailsPage;