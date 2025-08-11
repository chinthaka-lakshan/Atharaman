import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Chip,
  Button,
  Skeleton,
  Pagination,
  Fade,
  Grow
} from '@mui/material';
import {
  Search,
  LocationOn,
  Star,
  Explore
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { locations } from '../data/mockData';

const LocationsPage = () => {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [displayedLocations, setDisplayedLocations] = useState([]);
  const itemsPerPage = 6;

  const categories = ['Mountain', 'National Park', 'Historical Site', 'Wildlife Park', 'Beach', 'Archaeological Site', 'Sacred Mountain'];
  const ratings = [4.5, 4.0, 3.5, 3.0];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1200);
  }, []);

  useEffect(() => {
    let filtered = locations.filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           location.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || location.category === categoryFilter;
      const matchesRating = !ratingFilter || location.rating >= ratingFilter;
      
      return matchesSearch && matchesCategory && matchesRating;
    });
    
    setFilteredLocations(filtered);
    setPage(1);
  }, [searchQuery, categoryFilter, ratingFilter]);

  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * itemsPerPage;
    setDisplayedLocations(filteredLocations.slice(startIndex, endIndex));
  }, [filteredLocations, page]);

  const handleLocationClick = (locationId) => {
    navigate(`/location/${locationId}`);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleNextPage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setDisplayedLocations(filteredLocations.slice(page * itemsPerPage, (page + 1) * itemsPerPage));
    setPage(prev => prev + 1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setRatingFilter('');
  };

  const LocationCard = ({ location, index }) => (
    <Grow in={!loading} timeout={500 + index * 100}>
      <Card
        onClick={() => handleLocationClick(location.id)}
        sx={{
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-12px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            '& .card-image': {
              transform: 'scale(1.1)',
            },
            '& .card-overlay': {
              opacity: 1,
            }
          },
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="250"
            image={location.image}
            alt={location.name}
            className="card-image"
            sx={{
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              objectFit: 'cover',
            }}
          />
          <Box
            className="card-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(46, 125, 50, 0.8), rgba(255, 111, 0, 0.8))',
              opacity: 0,
              transition: 'opacity 0.4s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Explore sx={{ fontSize: '3rem', color: 'white' }} />
          </Box>
          <Chip
            label={location.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: 'primary.main',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}
          />
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              background: 'linear-gradient(45deg, #2E7D32, #FF6F00)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {location.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {location.location}
            </Typography>
          </Box>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
              height: '3.2em',
            }}
          >
            {location.shortDescription}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={location.rating} precision={0.1} size="small" readOnly />
              <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
                {location.rating}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              ({location.reviewCount} reviews)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );

  const SkeletonCard = ({ index }) => (
    <Card sx={{ height: '100%' }}>
      <Skeleton 
        variant="rectangular" 
        height={250} 
        animation="wave"
        sx={{ animationDelay: `${index * 100}ms` }}
      />
      <CardContent>
        <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={80} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #FF6F00 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Discover Amazing Locations
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                Explore breathtaking destinations and create unforgettable memories
              </Typography>
            </Box>
          </Fade>

          {/* Search and Filters */}
          <Fade in timeout={1000}>
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: 'rgba(255,255,255,0.7)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(255,255,255,0.8)',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255,255,255,0.7)',
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      sx={{
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.8)',
                        },
                      }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Rating</InputLabel>
                    <Select
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      sx={{
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.8)',
                        },
                      }}
                    >
                      <MenuItem value="">All Ratings</MenuItem>
                      {ratings.map((rating) => (
                        <MenuItem key={rating} value={rating}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ fontSize: '1rem', mr: 0.5 }} />
                            {rating}+ Stars
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {(searchQuery || categoryFilter || ratingFilter) && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    onClick={clearFilters}
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Results Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Results Count */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {loading ? 'Loading...' : `${filteredLocations.length} Amazing Locations`}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {loading ? 'Discovering the best destinations for you...' : 'Discover your next adventure destination'}
            </Typography>
          </Box>
        </Fade>

        {/* Location Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <SkeletonCard index={index} />
                </Grid>
              ))
            : displayedLocations.map((location, index) => (
                <Grid item xs={12} sm={6} lg={4} key={location.id}>
                  <LocationCard location={location} index={index} />
                </Grid>
              ))
          }
        </Grid>

        {/* No Results */}
        {!loading && filteredLocations.length === 0 && (
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
                No locations found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search criteria or filters
              </Typography>
              <Button 
                variant="contained" 
                onClick={clearFilters}
                sx={{
                  background: 'linear-gradient(45deg, #2E7D32, #FF6F00)',
                  px: 4,
                  py: 1.5,
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          </Fade>
        )}

        {/* Load More / Next Page */}
        {!loading && displayedLocations.length > 0 && displayedLocations.length < filteredLocations.length && (
          <Fade in timeout={1000}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 6 }}>
              <Button
                onClick={handleLoadMore}
                variant="outlined"
                size="large"
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
                Load More ({filteredLocations.length - displayedLocations.length} remaining)
              </Button>
              
              <Button
                onClick={handleNextPage}
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #2E7D32, #FF6F00)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(46, 125, 50, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Next Page
              </Button>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default LocationsPage;