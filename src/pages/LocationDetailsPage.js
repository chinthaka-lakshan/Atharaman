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
  IconButton,
  Dialog,
  DialogContent,
  Skeleton,
  Paper,
  Fade,
  Grow
} from '@mui/material';
import {
  LocationOn,
  Phone,
  NavigateNext,
  Close,
  ChevronLeft,
  ChevronRight,
  WbSunny,
  Cloud,
  Grain,
  Air,
  Thermostat,
  Water,
  Person,
  Store,
  Hotel,
  DirectionsCar
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
  const [weatherView, setWeatherView] = useState('current');

  useEffect(() => {
    setTimeout(() => {
      const foundLocation = locations.find(loc => loc.id === parseInt(id));
      setLocation(foundLocation);
      setLoading(false);
    }, 1000);
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

        {weatherView === 'current' && (
          <Fade in timeout={500}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ mb: 1, fontSize: '4rem' }}>
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
                    <Water color="primary" sx={{ mb: 1, fontSize: '2rem' }} />
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
                    <Air color="primary" sx={{ mb: 1, fontSize: '2rem' }} />
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
                    <Thermostat color="primary" sx={{ mb: 1, fontSize: '2rem' }} />
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
          </Fade>
        )}

        {weatherView === 'forecast' && (
          <Fade in timeout={500}>
            <Grid container spacing={2}>
              {location.weather.forecast.map((day, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      {day.day}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 1, fontSize: '2rem' }}>
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
          </Fade>
        )}

        {weatherView === 'historical' && (
          <Fade in timeout={500}>
            <Grid container spacing={2}>
              {location.weather.historical.map((day, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      {day.day}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 1, fontSize: '2rem' }}>
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
          </Fade>
        )}
      </CardContent>
    </Card>
  );

  const RecommendationSection = ({ title, items, type, icon }) => {
    const getFilteredItems = () => {
      return items.filter(item => 
        item.nearbyLocations && item.nearbyLocations.includes(location.name)
      ).slice(0, 3);
    };

    const filteredItems = getFilteredItems();

    if (filteredItems.length === 0) return null;

    return (
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {icon}
          <Typography variant="h5" sx={{ fontWeight: 600, ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {filteredItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Grow in timeout={500 + index * 100}>
                <Card
                  onClick={() => navigate(`/${type}/${item.id}`)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
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
                    {item.ownerName && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Owner: {item.ownerName}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ pt: 4, pb: 6 }}>
      <Container maxWidth="xl">
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
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

        <Fade in timeout={800}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
        </Fade>

        <Grid container spacing={6}>
          <Grid item xs={12} lg={8}>
            <Grow in timeout={1000}>
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
            </Grow>

            <Grow in timeout={1200}>
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
            </Grow>

            <Grow in timeout={1400}>
              <WeatherWidget />
            </Grow>

            <Grow in timeout={1600}>
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
                      borderColor: 'grey.300',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <LocationOn sx={{ fontSize: '3rem', color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                        Interactive Map
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lat: {location.coordinates.lat}, Lng: {location.coordinates.lng}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Google Maps integration ready
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Grow in timeout={1000}>
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
            </Grow>

            <Grow in timeout={1200}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Quick Stats
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main', mb: 1 }}>
                          {location.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rating
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
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
            </Grow>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Fade in timeout={1800}>
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
          </Fade>

          <RecommendationSection
            title="Suggested Guides"
            items={guides}
            type="guide"
            icon={<Person sx={{ fontSize: '2rem', color: 'primary.main' }} />}
          />

          <RecommendationSection
            title="Suggested Shops"
            items={shops}
            type="shop"
            icon={<Store sx={{ fontSize: '2rem', color: 'secondary.main' }} />}
          />

          <RecommendationSection
            title="Suggested Vehicles"
            items={vehicles}
            type="vehicle"
            icon={<DirectionsCar sx={{ fontSize: '2rem', color: 'primary.main' }} />}
          />

          <RecommendationSection
            title="Suggested Hotels"
            items={hotels}
            type="hotel"
            icon={<Hotel sx={{ fontSize: '2rem', color: 'secondary.main' }} />}
          />
        </Box>

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
  <Box sx={{ pt: 4, pb: 6 }}>
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