// Comprehensive mock data for the location discovery application
export const locations = [
  {
    id: 1,
    name: 'Ella Rock',
    location: 'Ella, Uva Province',
    address: 'Ella Rock Trail, Ella 90090, Sri Lanka',
    coordinates: { lat: 6.8667, lng: 81.0500 },
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 324,
    category: 'Mountain',
    shortDescription: 'Breathtaking views and perfect camping spots with stunning sunrise vistas.',
    longDescription: 'Ella Rock is one of Sri Lanka\'s most iconic hiking destinations, offering spectacular panoramic views of the surrounding tea plantations and mountains. The trek to the summit takes approximately 2-3 hours through scenic tea estates and local villages. The rock formation provides an excellent vantage point for sunrise and sunset photography, making it a favorite among both local and international travelers. The area is rich in biodiversity with various endemic flora and fauna.',
    contact: '+94 57 222 8888',
    priceRange: '$',
    distance: '12 km from Ella town',
    weather: {
      current: {
        temperature: 24,
        condition: 'Partly Cloudy',
        humidity: 78,
        windSpeed: 12,
        icon: 'partly-cloudy'
      },
      forecast: [
        { day: 'Today', high: 26, low: 18, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Tomorrow', high: 28, low: 19, condition: 'Sunny', icon: 'sunny' },
        { day: 'Wed', high: 25, low: 17, condition: 'Rainy', icon: 'rainy' },
        { day: 'Thu', high: 27, low: 20, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Fri', high: 29, low: 21, condition: 'Sunny', icon: 'sunny' },
        { day: 'Sat', high: 26, low: 18, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Sun', high: 24, low: 16, condition: 'Rainy', icon: 'rainy' }
      ],
      historical: [
        { day: '7 days ago', high: 25, low: 17, condition: 'Sunny', icon: 'sunny' },
        { day: '6 days ago', high: 27, low: 19, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: '5 days ago', high: 23, low: 15, condition: 'Rainy', icon: 'rainy' },
        { day: '4 days ago', high: 26, low: 18, condition: 'Cloudy', icon: 'cloudy' },
        { day: '3 days ago', high: 28, low: 20, condition: 'Sunny', icon: 'sunny' },
        { day: '2 days ago', high: 24, low: 16, condition: 'Rainy', icon: 'rainy' },
        { day: 'Yesterday', high: 25, low: 18, condition: 'Partly Cloudy', icon: 'partly-cloudy' }
      ]
    }
  },
  {
    id: 2,
    name: 'Horton Plains National Park',
    location: 'Nuwara Eliya, Central Province',
    address: 'Horton Plains National Park, Nuwara Eliya 22200, Sri Lanka',
    coordinates: { lat: 6.8069, lng: 80.7906 },
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.9,
    reviewCount: 567,
    category: 'National Park',
    shortDescription: 'UNESCO World Heritage site with stunning landscapes and World\'s End cliff.',
    longDescription: 'Horton Plains National Park is a protected area in the central highlands of Sri Lanka and is covered by montane grassland and cloud forest. The park is a popular tourist destination and is situated on a plateau at an altitude of 2,100–2,300 meters. It is rich in biodiversity and many species found here are endemic to the region. World\'s End is a sheer precipice with a 870m drop, offering breathtaking views on clear days.',
    contact: '+94 52 222 7272',
    priceRange: '$$',
    distance: '32 km from Nuwara Eliya',
    weather: {
      current: {
        temperature: 16,
        condition: 'Cloudy',
        humidity: 85,
        windSpeed: 18,
        icon: 'cloudy'
      },
      forecast: [
        { day: 'Today', high: 18, low: 12, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Tomorrow', high: 20, low: 14, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Wed', high: 17, low: 11, condition: 'Rainy', icon: 'rainy' },
        { day: 'Thu', high: 19, low: 13, condition: 'Foggy', icon: 'foggy' },
        { day: 'Fri', high: 21, low: 15, condition: 'Sunny', icon: 'sunny' },
        { day: 'Sat', high: 18, low: 12, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Sun', high: 16, low: 10, condition: 'Rainy', icon: 'rainy' }
      ],
      historical: [
        { day: '7 days ago', high: 17, low: 11, condition: 'Rainy', icon: 'rainy' },
        { day: '6 days ago', high: 19, low: 13, condition: 'Cloudy', icon: 'cloudy' },
        { day: '5 days ago', high: 15, low: 9, condition: 'Foggy', icon: 'foggy' },
        { day: '4 days ago', high: 18, low: 12, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: '3 days ago', high: 20, low: 14, condition: 'Sunny', icon: 'sunny' },
        { day: '2 days ago', high: 16, low: 10, condition: 'Rainy', icon: 'rainy' },
        { day: 'Yesterday', high: 17, low: 11, condition: 'Cloudy', icon: 'cloudy' }
      ]
    }
  },
  {
    id: 3,
    name: 'Knuckles Mountain Range',
    location: 'Matale, Central Province',
    address: 'Knuckles Conservation Forest, Matale, Sri Lanka',
    coordinates: { lat: 7.4500, lng: 80.7500 },
    image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.7,
    reviewCount: 289,
    category: 'Mountain Range',
    shortDescription: 'Adventure camping in pristine mountain wilderness with diverse ecosystems.',
    longDescription: 'The Knuckles Mountain Range, also known as the Knuckles Massif, lies in central Sri Lanka, in the Districts of Matale and Kandy. The range is named for its resemblance to a clenched fist. It is a UNESCO World Heritage Site and is home to many endemic species of flora and fauna. The area offers excellent opportunities for trekking, camping, and wildlife observation in one of Sri Lanka\'s most biodiverse regions.',
    contact: '+94 66 223 4567',
    priceRange: '$',
    distance: '45 km from Kandy',
    weather: {
      current: {
        temperature: 22,
        condition: 'Sunny',
        humidity: 72,
        windSpeed: 8,
        icon: 'sunny'
      },
      forecast: [
        { day: 'Today', high: 24, low: 16, condition: 'Sunny', icon: 'sunny' },
        { day: 'Tomorrow', high: 26, low: 18, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Wed', high: 23, low: 15, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Thu', high: 25, low: 17, condition: 'Sunny', icon: 'sunny' },
        { day: 'Fri', high: 27, low: 19, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Sat', high: 24, low: 16, condition: 'Rainy', icon: 'rainy' },
        { day: 'Sun', high: 22, low: 14, condition: 'Cloudy', icon: 'cloudy' }
      ],
      historical: [
        { day: '7 days ago', high: 23, low: 15, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: '6 days ago', high: 25, low: 17, condition: 'Sunny', icon: 'sunny' },
        { day: '5 days ago', high: 21, low: 13, condition: 'Rainy', icon: 'rainy' },
        { day: '4 days ago', high: 24, low: 16, condition: 'Cloudy', icon: 'cloudy' },
        { day: '3 days ago', high: 26, low: 18, condition: 'Sunny', icon: 'sunny' },
        { day: '2 days ago', high: 22, low: 14, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Yesterday', high: 23, low: 15, condition: 'Sunny', icon: 'sunny' }
      ]
    }
  },
  {
    id: 4,
    name: 'Sigiriya Rock Fortress',
    location: 'Dambulla, Central Province',
    address: 'Sigiriya, Dambulla 21120, Sri Lanka',
    coordinates: { lat: 7.9570, lng: 80.7603 },
    image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.9,
    reviewCount: 1234,
    category: 'Historical Site',
    shortDescription: 'Ancient rock fortress with spectacular views and rich history.',
    longDescription: 'Sigiriya is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka. It is a UNESCO World Heritage Site and one of the best preserved examples of ancient urban planning. Built during the reign of King Kashyapa (477-495 CE), it features remarkable frescoes, mirror wall, and water gardens that showcase the ingenuity of ancient Sri Lankan civilization.',
    contact: '+94 66 228 6846',
    priceRange: '$$',
    distance: '19 km from Dambulla',
    weather: {
      current: {
        temperature: 28,
        condition: 'Sunny',
        humidity: 68,
        windSpeed: 6,
        icon: 'sunny'
      },
      forecast: [
        { day: 'Today', high: 30, low: 22, condition: 'Sunny', icon: 'sunny' },
        { day: 'Tomorrow', high: 32, low: 24, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Wed', high: 29, low: 21, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Thu', high: 31, low: 23, condition: 'Sunny', icon: 'sunny' },
        { day: 'Fri', high: 33, low: 25, condition: 'Hot', icon: 'sunny' },
        { day: 'Sat', high: 30, low: 22, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Sun', high: 28, low: 20, condition: 'Rainy', icon: 'rainy' }
      ],
      historical: [
        { day: '7 days ago', high: 29, low: 21, condition: 'Sunny', icon: 'sunny' },
        { day: '6 days ago', high: 31, low: 23, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: '5 days ago', high: 27, low: 19, condition: 'Rainy', icon: 'rainy' },
        { day: '4 days ago', high: 30, low: 22, condition: 'Cloudy', icon: 'cloudy' },
        { day: '3 days ago', high: 32, low: 24, condition: 'Sunny', icon: 'sunny' },
        { day: '2 days ago', high: 28, low: 20, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Yesterday', high: 29, low: 21, condition: 'Sunny', icon: 'sunny' }
      ]
    }
  },
  {
    id: 5,
    name: 'Yala National Park',
    location: 'Hambantota, Southern Province',
    address: 'Yala National Park, Tissamaharama, Sri Lanka',
    coordinates: { lat: 6.3725, lng: 81.5185 },
    image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.6,
    reviewCount: 892,
    category: 'Wildlife Park',
    shortDescription: 'Premier wildlife destination famous for leopards and diverse ecosystems.',
    longDescription: 'Yala National Park is the most visited and second largest national park in Sri Lanka, bordering the Indian Ocean. The park consists of five blocks, two of which are now open to the public, and also adjoining parks. It is situated in the southeast region of the country, and lies in Southern Province and Uva Province. The park is best known for its variety of wild animals and is famous for having the highest density of leopards in the world.',
    contact: '+94 47 223 9449',
    priceRange: '$$',
    distance: '24 km from Tissamaharama',
    weather: {
      current: {
        temperature: 32,
        condition: 'Hot',
        humidity: 65,
        windSpeed: 10,
        icon: 'sunny'
      },
      forecast: [
        { day: 'Today', high: 34, low: 26, condition: 'Hot', icon: 'sunny' },
        { day: 'Tomorrow', high: 35, low: 27, condition: 'Sunny', icon: 'sunny' },
        { day: 'Wed', high: 33, low: 25, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Thu', high: 36, low: 28, condition: 'Hot', icon: 'sunny' },
        { day: 'Fri', high: 34, low: 26, condition: 'Sunny', icon: 'sunny' },
        { day: 'Sat', high: 32, low: 24, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Sun', high: 30, low: 22, condition: 'Rainy', icon: 'rainy' }
      ],
      historical: [
        { day: '7 days ago', high: 33, low: 25, condition: 'Sunny', icon: 'sunny' },
        { day: '6 days ago', high: 35, low: 27, condition: 'Hot', icon: 'sunny' },
        { day: '5 days ago', high: 31, low: 23, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: '4 days ago', high: 34, low: 26, condition: 'Sunny', icon: 'sunny' },
        { day: '3 days ago', high: 36, low: 28, condition: 'Hot', icon: 'sunny' },
        { day: '2 days ago', high: 32, low: 24, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Yesterday', high: 33, low: 25, condition: 'Sunny', icon: 'sunny' }
      ]
    }
  }
];

export const guides = [
  {
    id: 1,
    name: 'Kasun Perera',
    location: 'Ella, Uva Province',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviewCount: 156,
    experience: '8 years',
    specialties: ['Mountain Trekking', 'Wildlife Photography', 'Cultural Tours'],
    languages: ['English', 'Sinhala', 'Tamil'],
    pricePerDay: 45,
    description: 'Expert mountain guide with extensive knowledge of Ella region and surrounding peaks.',
    contact: '+94 77 123 4567',
    availability: 'Available'
  },
  {
    id: 2,
    name: 'Nimal Silva',
    location: 'Nuwara Eliya, Central Province',
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviewCount: 203,
    experience: '12 years',
    specialties: ['Tea Country Tours', 'Camping Expert', 'Bird Watching'],
    languages: ['English', 'Sinhala', 'German'],
    pricePerDay: 55,
    description: 'Specialized in tea country adventures and high-altitude camping experiences.',
    contact: '+94 77 234 5678',
    availability: 'Available'
  },
  {
    id: 3,
    name: 'Chaminda Fernando',
    location: 'Kandy, Central Province',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviewCount: 134,
    experience: '6 years',
    specialties: ['Cultural Tours', 'Adventure Sports', 'Historical Sites'],
    languages: ['English', 'Sinhala', 'French'],
    pricePerDay: 40,
    description: 'Cultural heritage expert with passion for adventure sports and historical exploration.',
    contact: '+94 77 345 6789',
    availability: 'Busy until next week'
  }
];

export const shops = [
  {
    id: 1,
    name: 'Adventure Gear Lanka',
    location: 'Colombo, Western Province',
    image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Camping Equipment',
    rating: 4.6,
    reviewCount: 89,
    products: ['Tents', 'Sleeping Bags', 'Hiking Gear', 'Backpacks'],
    description: 'Premier outdoor equipment store with high-quality camping and hiking gear.',
    contact: '+94 11 234 5678',
    address: '123 Galle Road, Colombo 03',
    openHours: '9:00 AM - 8:00 PM'
  },
  {
    id: 2,
    name: 'Mountain Sports',
    location: 'Kandy, Central Province',
    image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Outdoor Sports',
    rating: 4.5,
    reviewCount: 67,
    products: ['Climbing Gear', 'Backpacks', 'Navigation Tools', 'Safety Equipment'],
    description: 'Specialized in mountain sports equipment and professional climbing gear.',
    contact: '+94 81 234 5678',
    address: '45 Peradeniya Road, Kandy',
    openHours: '8:30 AM - 7:30 PM'
  },
  {
    id: 3,
    name: 'Nature\'s Best',
    location: 'Galle, Southern Province',
    image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Eco-Friendly Gear',
    rating: 4.7,
    reviewCount: 112,
    products: ['Solar Chargers', 'Water Filters', 'Eco Tents', 'Sustainable Gear'],
    description: 'Eco-conscious outdoor equipment store focusing on sustainable adventure gear.',
    contact: '+94 91 234 5678',
    address: '78 Main Street, Galle Fort',
    openHours: '9:00 AM - 6:00 PM'
  }
];

export const vehicles = [
  {
    id: 1,
    vehicleName: 'Toyota Land Cruiser',
    ownerName: 'Sunil Bandara',
    image: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    pricePerDay: 75,
    capacity: '7 passengers',
    features: ['4WD', 'AC', 'GPS', 'First Aid Kit', 'Cooler Box'],
    location: 'Colombo, Western Province',
    rating: 4.8,
    reviewCount: 45,
    description: 'Reliable 4WD vehicle perfect for mountain adventures and rough terrain.',
    contact: '+94 77 456 7890',
    availability: 'Available'
  },
  {
    id: 2,
    vehicleName: 'Mitsubishi Montero',
    ownerName: 'Ravi Jayasinghe',
    image: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    pricePerDay: 65,
    capacity: '5 passengers',
    features: ['4WD', 'AC', 'Music System', 'Cooler Box', 'Phone Charger'],
    location: 'Kandy, Central Province',
    rating: 4.6,
    reviewCount: 32,
    description: 'Comfortable SUV ideal for family adventures and camping trips.',
    contact: '+94 77 567 8901',
    availability: 'Available'
  },
  {
    id: 3,
    vehicleName: 'Nissan X-Trail',
    ownerName: 'Mahesh Silva',
    image: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    pricePerDay: 55,
    capacity: '5 passengers',
    features: ['AWD', 'AC', 'Bluetooth', 'Roof Rails', 'USB Ports'],
    location: 'Galle, Southern Province',
    rating: 4.7,
    reviewCount: 28,
    description: 'Modern crossover SUV with excellent fuel efficiency and comfort.',
    contact: '+94 77 678 9012',
    availability: 'Booked until next month'
  }
];

export const hotels = [
  {
    id: 1,
    name: 'Ella Jungle Resort',
    location: 'Ella, Uva Province',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    reviewCount: 234,
    pricePerNight: 120,
    amenities: ['Pool', 'Restaurant', 'Spa', 'WiFi', 'Mountain View'],
    description: 'Luxury eco-resort nestled in the heart of Ella\'s lush jungle landscape.',
    contact: '+94 57 222 8888',
    address: 'Jungle Path, Ella 90090',
    checkIn: '2:00 PM',
    checkOut: '12:00 PM'
  },
  {
    id: 2,
    name: 'Hill Country Lodge',
    location: 'Nuwara Eliya, Central Province',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    reviewCount: 156,
    pricePerNight: 95,
    amenities: ['Fireplace', 'Garden', 'Restaurant', 'WiFi', 'Tea Plantation View'],
    description: 'Charming colonial-style lodge with stunning tea plantation views.',
    contact: '+94 52 222 7777',
    address: 'Tea Estate Road, Nuwara Eliya 22200',
    checkIn: '3:00 PM',
    checkOut: '11:00 AM'
  },
  {
    id: 3,
    name: 'Mountain View Hotel',
    location: 'Kandy, Central Province',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    reviewCount: 189,
    pricePerNight: 85,
    amenities: ['Balcony', 'Restaurant', 'Tour Desk', 'WiFi', 'City View'],
    description: 'Modern hotel with panoramic mountain views and excellent service.',
    contact: '+94 81 222 6666',
    address: '56 Kandy Road, Kandy 20000',
    checkIn: '2:00 PM',
    checkOut: '12:00 PM'
  }
];

// Weather icons mapping
export const weatherIcons = {
  'sunny': '☀️',
  'partly-cloudy': '⛅',
  'cloudy': '☁️',
  'rainy': '🌧️',
  'foggy': '🌫️',
  'hot': '🌡️'
};