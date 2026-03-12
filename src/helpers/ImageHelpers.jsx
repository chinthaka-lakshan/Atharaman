export const getGuideImageUrls = (guide) => {
  if (!guide || !guide.guideImage) return [];
  
  let images = [];
  
  try {
    images = typeof guide.guideImage === 'string' 
      ? JSON.parse(guide.guideImage) 
      : guide.guideImage;
  } catch (e) {
    images = [guide.guideImage];
  }
  
  return images.map(image => {
    if (image && image.startsWith('guides/')) {
      return `http://localhost:8000/storage/${image}`;
    } else if (image) {
      return `http://localhost:8000/storage/guides/${image}`;
    }
    return "/default-guide.jpg";
  });
};

export const getMainGuideImage = (guide) => {
  const urls = getGuideImageUrls(guide);
  return urls[0] || "/default-guide.jpg";
};

export const getShopImageUrls = (shop) => {
  if (!shop || !shop.shopImage) return [];
  
  let images = [];
  
  try {
    images = typeof shop.shopImage === 'string' 
      ? JSON.parse(shop.shopImage) 
      : shop.shopImage;
  } catch (e) {
    images = [shop.shopImage];
  }
  
  return images.map(image => {
    if (image && image.startsWith('shops/')) {
      return `http://localhost:8000/storage/${image}`;
    } else if (image) {
      return `http://localhost:8000/storage/shops/${image}`;
    }
    return "/default-shop.jpg";
  });
};

export const getMainShopImage = (shop) => {
  const urls = getShopImageUrls(shop);
  return urls[0] || "/default-shop.jpg";
};

export const getHotelImageUrls = (hotel) => {
  if (!hotel || !hotel.hotelImage) return [];
  
  let images = [];
  
  try {
    images = typeof hotel.hotelImage === 'string' 
      ? JSON.parse(hotel.hotelImage) 
      : hotel.hotelImage;
  } catch (e) {
    images = [hotel.hotelImage];
  }
  
  return images.map(image => {
    if (image && image.startsWith('hotels/')) {
      return `http://localhost:8000/storage/${image}`;
    } else if (image) {
      return `http://localhost:8000/storage/hotels/${image}`;
    }
    return "/default-hotel.jpg";
  });
};

export const getMainHotelImage = (hotel) => {
  const urls = getHotelImageUrls(hotel);
  return urls[0] || "/default-hotel.jpg";
};

export const getVehicleImageUrls = (vehicle) => {
  if (!vehicle || !vehicle.vehicleImage) return [];
  
  let images = [];
  
  try {
    images = typeof vehicle.vehicleImage === 'string' 
      ? JSON.parse(vehicle.vehicleImage) 
      : vehicle.vehicleImage;
  } catch (e) {
    images = [vehicle.vehicleImage];
  }
  
  return images.map(image => {
    if (image && image.startsWith('vehicles/')) {
      return `http://localhost:8000/storage/${image}`;
    } else if (image) {
      return `http://localhost:8000/storage/vehicles/${image}`;
    }
    return "/default-vehicle.jpg";
  });
};

export const getMainVehicleImage = (vehicle) => {
  const urls = getVehicleImageUrls(vehicle);
  return urls[0] || "/default-vehicle.jpg";
};