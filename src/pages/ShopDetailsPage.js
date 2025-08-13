import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Rating,
  Chip,
  Button,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Fade,
  Grow
} from '@mui/material';
import {
  LocationOn,
  Phone,
  NavigateNext,
  Store,
  Schedule,
  CheckCircle,
  Message
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { shops } from '../data/mockData';

const ShopDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const foundShop = shops.find(s => s.id === parseInt(id));
      setShop(foundShop);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return <ShopDetailsSkeleton />;
  }

  if (!shop) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Shop not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/locations')}>
          Back to Locations
        </Button>
      </Container>
    );
  }

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
            {shop.name}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Grow in timeout={800}>
              <Card>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={shop.image}
                    sx={{ width: 150, height: 150, mx: 'auto', mb: 2, borderRadius: 2 }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {shop.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body1" color="text.secondary">
                      {shop.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Rating value={shop.rating} precision={0.1} readOnly />
                    <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>
                      {shop.rating} ({shop.reviewCount} reviews)
                    </Typography>
                  </Box>
                  <Chip
                    label={shop.category}
                    color="primary"
                    sx={{ mb: 3 }}
                  />
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
                    Contact Shop
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Phone />}
                  >
                    {shop.contact}
                  </Button>
                </Box>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={8}>
            <Fade in timeout={1000}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    About {shop.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                    {shop.description}
                  </Typography>
                  
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Address
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Store sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1">
                          {shop.address}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Opening Hours
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Schedule sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1">
                          {shop.openHours}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>

            <Grow in timeout={1200}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Products & Services
                  </Typography>
                  <List>
                    {shop.products.map((product, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircle color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={product} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const ShopDetailsSkeleton = () => (
  <Box sx={{ pt: 4, pb: 6 }}>
    <Container maxWidth="xl">
      <Skeleton variant="text" width={200} height={30} sx={{ mb: 3 }} />
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Card>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Skeleton variant="rectangular" width={150} height={150} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
              <Skeleton variant="text" width={100} height={30} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={40} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Skeleton variant="rectangular" height={300} sx={{ mb: 4, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default ShopDetailsPage;