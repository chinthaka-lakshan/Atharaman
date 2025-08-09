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
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Star,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { locations } from '../data/mockData';

const LocationsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const itemsPerPage = 6;

  const categories = ['Mountain', 'National Park', 'Historical Site', 'Wildlife Park', 'Beach', 'Cultural Site'];
  const ratings = [4.5, 4.0, 3.5, 3.0];
  const priceRanges = ['$', '$$', '$$$'];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    let filtered = locations.filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           location.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || location.category === categoryFilter;
      const matchesRating = !ratingFilter || location.rating >= ratingFilter;
      const matchesPrice = !priceFilter || location.priceRange === priceFilter;
      
      return matchesSearch && matchesCategory && matchesRating && matchesPrice;
    });
    
    setFilteredLocations(filtered);
    setPage(1);
  }, [searchQuery, categoryFilter, ratingFilter, priceFilter]);

  const handleLocationClick = (locationId) => {
    navigate(`/location/${locationId}`);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setRatingFilter('');
    setPriceFilter('');
  };

  const paginatedLocations = filteredLocations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const FilterControls = () => (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
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
        
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Rating</InputLabel>
            <Select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              <MenuItem value="">All Ratings</MenuItem>
              {ratings.map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating}+ Stars
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Price Range</InputLabel>
            <Select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              <MenuItem value="">All Prices</MenuItem>
              {priceRanges.map((price) => (
                <MenuItem key={price} value={price}>
                  {price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Button
            variant="outlined"
            onClick={clearFilters}
            fullWidth
            sx={{ 
              height: 56,
              borderRadius: 3,
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.light',
                color: 'white'
              }
            }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const LocationCard = ({ location }) => (
    <Card
      onClick={() => handleLocationClick(location.id)}
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
        height="250"
        image={location.image}
        alt={location.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {location.name}
          </Typography>
          <Chip
            label={location.category}
            size="small"
            sx={{
              bgcolor: 'primary.light',
              color: 'white',
              fontWeight: 500,
              ml: 1
            }}
          />
        </Box>
        
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
            lineHeight: 1.5
          }}
        >
          {location.shortDescription}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={location.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
              {location.rating}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            ({location.reviewCount} reviews)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const SkeletonCard = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={250} />
      <CardContent>
        <Skeleton variant="text" height={32} width="80%" />
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
    <Box sx={{ pt: 10, pb: 6, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        {/* Header */}
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
            Discover Amazing Locations
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Explore breathtaking destinations and create unforgettable memories
          </Typography>
        </Box>

        {/* Mobile Filter Button */}
        {isMobile && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDrawerOpen(true)}
              fullWidth
              sx={{ borderRadius: 3, py: 1.5 }}
            >
              Filters & Search
            </Button>
          </Box>
        )}

        {/* Desktop Filters */}
        {!isMobile && <FilterControls />}

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="bottom"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              p: 3,
              maxHeight: '80vh'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters & Search
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <FilterControls />
        </Drawer>

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>

        {/* Location Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <SkeletonCard />
                </Grid>
              ))
            : paginatedLocations.map((location) => (
                <Grid item xs={12} sm={6} lg={4} key={location.id}>
                  <LocationCard location={location} />
                </Grid>
              ))
          }
        </Grid>

        {/* No Results */}
        {!loading && filteredLocations.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
              No locations found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or filters
            </Typography>
            <Button variant="contained" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </Box>
        )}

        {/* Pagination */}
        {!loading && filteredLocations.length > itemsPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={Math.ceil(filteredLocations.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  fontWeight: 500,
                }
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default LocationsPage;