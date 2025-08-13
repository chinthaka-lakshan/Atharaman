// Weather icons mapping
export const weatherIcons = {
  'sunny': '☀️',
  'partly-cloudy': '⛅',
  'cloudy': '☁️',
  'rainy': '🌧️',
  'foggy': '🌫️',
  'hot': '🌡️',
  'windy': '💨',
  'stormy': '⛈️'
};

// Comprehensive locations data
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
    shortDescription: 'Breathtaking views and perfect camping spots with stunning sunrise vistas over the hill country.',
    longDescription: 'Ella Rock is one of Sri Lanka\'s most iconic hiking destinations, offering spectacular panoramic views of the surrounding tea plantations and mountains. The trek to the summit takes approximately 2-3 hours through scenic tea estates and local villages. The rock formation provides an excellent vantage point for sunrise and sunset photography, making it a favorite among both local and international travelers. The area is rich in biodiversity with various endemic flora and fauna, and the cool climate makes it perfect for camping under the stars.',
    contact: '+94 57 222 8888',
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
    shortDescription: 'UNESCO World Heritage site with stunning landscapes and the famous World\'s End cliff.',
    longDescription: 'Horton Plains National Park is a protected area in the central highlands of Sri Lanka and is covered by montane grassland and cloud forest. The park is a popular tourist destination and is situated on a plateau at an altitude of 2,100–2,300 meters. It is rich in biodiversity and many species found here are endemic to the region. World\'s End is a sheer precipice with a 870m drop, offering breathtaking views on clear days. The park is also home to Baker\'s Falls, a beautiful waterfall that cascades down rocky terrain.',
    contact: '+94 52 222 7272',
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
    shortDescription: 'Adventure camping in pristine mountain wilderness with diverse ecosystems and endemic species.',
    longDescription: 'The Knuckles Mountain Range, also known as the Knuckles Massif, lies in central Sri Lanka, in the Districts of Matale and Kandy. The range is named for its resemblance to a clenched fist when viewed from certain angles. It is a UNESCO World Heritage Site and is home to many endemic species of flora and fauna. The area offers excellent opportunities for trekking, camping, and wildlife observation in one of Sri Lanka\'s most biodiverse regions. The climate varies dramatically with altitude, creating unique micro-ecosystems.',
    contact: '+94 66 223 4567',
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
    shortDescription: 'Ancient rock fortress with spectacular views and rich history dating back to 5th century.',
    longDescription: 'Sigiriya is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka. It is a UNESCO World Heritage Site and one of the best preserved examples of ancient urban planning. Built during the reign of King Kashyapa (477-495 CE), it features remarkable frescoes, mirror wall, and water gardens that showcase the ingenuity of ancient Sri Lankan civilization. The climb to the top involves 1,200 steps and offers panoramic views of the surrounding landscape.',
    contact: '+94 66 228 6846',
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
        { day: 'Fri', high: 33, low: 25, condition: 'Hot', icon: 'hot' },
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
    shortDescription: 'Premier wildlife destination famous for leopards and diverse ecosystems along the coast.',
    longDescription: 'Yala National Park is the most visited and second largest national park in Sri Lanka, bordering the Indian Ocean. The park consists of five blocks, two of which are now open to the public, and also adjoining parks. It is situated in the southeast region of the country, and lies in Southern Province and Uva Province. The park is best known for its variety of wild animals and is famous for having the highest density of leopards in the world. It also houses elephants, sloth bears, spotted deer, and over 215 bird species.',
    contact: '+94 47 223 9449',
    distance: '24 km from Tissamaharama',
    weather: {
      current: {
        temperature: 32,
        condition: 'Hot',
        humidity: 65,
        windSpeed: 10,
        icon: 'hot'
      },
      forecast: [
        { day: 'Today', high: 34, low: 26, condition: 'Hot', icon: 'hot' },
        { day: 'Tomorrow', high: 35, low: 27, condition: 'Sunny', icon: 'sunny' },
        { day: 'Wed', high: 33, low: 25, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Thu', high: 36, low: 28, condition: 'Hot', icon: 'hot' },
        { day: 'Fri', high: 34, low: 26, condition: 'Sunny', icon: 'sunny' },
        { day: 'Sat', high: 32, low: 24, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Sun', high: 30, low: 22, condition: 'Rainy', icon: 'rainy' }
      ],
      historical: [
        { day: '7 days ago', high: 33, low: 25, condition: 'Sunny', icon: 'sunny' },
        { day: '6 days ago', high: 35, low: 27, condition: 'Hot', icon: 'hot' },
        { day: '5 days ago', high: 31, low: 23, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: '4 days ago', high: 34, low: 26, condition: 'Sunny', icon: 'sunny' },
        { day: '3 days ago', high: 36, low: 28, condition: 'Hot', icon: 'hot' },
        { day: '2 days ago', high: 32, low: 24, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Yesterday', high: 33, low: 25, condition: 'Sunny', icon: 'sunny' }
      ]
    }
  },
  {
    id: 6,
    name: 'Adam\'s Peak',
    location: 'Ratnapura, Sabaragamuwa Province',
    address: 'Sri Pada, Ratnapura, Sri Lanka',
    coordinates: { lat: 6.8094, lng: 80.4993 },
    image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 456,
    category: 'Sacred Mountain',
    shortDescription: 'Sacred pilgrimage site with challenging night climb and spectacular sunrise views.',
    longDescription: 'Adam\'s Peak, known locally as Sri Pada, is a 2,243m tall conical mountain located in central Sri Lanka. It is well known for the Sri Pada, a 1.8m rock formation near the summit, which is believed by Buddhists to be the footprint of Buddha. The mountain is considered sacred by multiple religions and attracts thousands of pilgrims annually. The traditional climbing season runs from December to May, with most climbers starting the ascent in the early hours to reach the summit for sunrise.',
    contact: '+94 45 222 5555',
    distance: '32 km from Ratnapura',
    weather: {
      current: {
        temperature: 20,
        condition: 'Cloudy',
        humidity: 82,
        windSpeed: 15,
        icon: 'cloudy'
      },
      forecast: [
        { day: 'Today', high: 22, low: 14, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Tomorrow', high: 24, low: 16, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Wed', high: 21, low: 13, condition: 'Rainy', icon: 'rainy' },
        { day: 'Thu', high: 23, low: 15, condition: 'Foggy', icon: 'foggy' },
        { day: 'Fri', high: 25, low: 17, condition: 'Sunny', icon: 'sunny' },
        { day: 'Sat', high: 22, low: 14, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Sun', high: 20, low: 12, condition: 'Rainy', icon: 'rainy' }
      ],
      historical: [
        { day: '7 days ago', high: 21, low: 13, condition: 'Rainy', icon: 'rainy' },
        { day: '6 days ago', high: 23, low: 15, condition: 'Cloudy', icon: 'cloudy' },
        { day: '5 days ago', high: 19, low: 11, condition: 'Foggy', icon: 'foggy' },
        { day: '4 days ago', high: 22, low: 14, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: '3 days ago', high: 24, low: 16, condition: 'Sunny', icon: 'sunny' },
        { day: '2 days ago', high: 20, low: 12, condition: 'Rainy', icon: 'rainy' },
        { day: 'Yesterday', high: 21, low: 13, condition: 'Cloudy', icon: 'cloudy' }
      ]
    }
  },
  {
    id: 7,
    name: 'Mirissa Beach',
    location: 'Mirissa, Southern Province',
    address: 'Mirissa Beach, Mirissa 81740, Sri Lanka',
    coordinates: { lat: 5.9487, lng: 80.4585 },
    image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.7,
    reviewCount: 678,
    category: 'Beach',
    shortDescription: 'Pristine golden beach perfect for whale watching and sunset views with palm trees.',
    longDescription: 'Mirissa is a small town on the south coast of Sri Lanka, located in the Matara District of the Southern Province. It is approximately 150 kilometers south of Colombo and is situated at an elevation of 4 meters above sea level. Mirissa is the largest fishing port on the south coast and is known for its tuna, mullet, snapper and butterfish. The beach is famous for whale watching tours, especially blue whales and sperm whales, which can be spotted from December to April.',
    contact: '+94 41 225 6789',
    distance: '4 km from Weligama',
    weather: {
      current: {
        temperature: 29,
        condition: 'Sunny',
        humidity: 75,
        windSpeed: 12,
        icon: 'sunny'
      },
      forecast: [
        { day: 'Today', high: 31, low: 25, condition: 'Sunny', icon: 'sunny' },
        { day: 'Tomorrow', high: 32, low: 26, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Wed', high: 30, low: 24, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Thu', high: 33, low: 27, condition: 'Sunny', icon: 'sunny' },
        { day: 'Fri', high: 31, low: 25, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Sat', high: 29, low: 23, condition: 'Rainy', icon: 'rainy' },
        { day: 'Sun', high: 28, low: 22, condition: 'Stormy', icon: 'stormy' }
      ],
      historical: [
        { day: '7 days ago', high: 30, low: 24, condition: 'Sunny', icon: 'sunny' },
        { day: '6 days ago', high: 32, low: 26, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: '5 days ago', high: 28, low: 22, condition: 'Rainy', icon: 'rainy' },
        { day: '4 days ago', high: 31, low: 25, condition: 'Cloudy', icon: 'cloudy' },
        { day: '3 days ago', high: 33, low: 27, condition: 'Sunny', icon: 'sunny' },
        { day: '2 days ago', high: 29, low: 23, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Yesterday', high: 30, low: 24, condition: 'Sunny', icon: 'sunny' }
      ]
    }
  },
  {
    id: 8,
    name: 'Polonnaruwa Ancient City',
    location: 'Polonnaruwa, North Central Province',
    address: 'Ancient City of Polonnaruwa, Polonnaruwa, Sri Lanka',
    coordinates: { lat: 7.9403, lng: 81.0188 },
    image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.6,
    reviewCount: 543,
    category: 'Archaeological Site',
    shortDescription: 'Ancient capital with well-preserved ruins, temples, and royal palaces from medieval period.',
    longDescription: 'Polonnaruwa is the main town of Polonnaruwa District in North Central Province, Sri Lanka. The second most ancient of Sri Lanka\'s kingdoms, Polonnaruwa was first declared the capital city by King Vijayabahu I, who defeated the Chola invaders in 1070 CE to reunite the country once more under a local leader. The Ancient City of Polonnaruwa has been declared a World Heritage Site. Today the ancient city of Polonnaruwa remains one of the best planned archaeological relic sites in the country.',
    contact: '+94 27 222 2299',
    distance: '8 km from Polonnaruwa town',
    weather: {
      current: {
        temperature: 31,
        condition: 'Hot',
        humidity: 70,
        windSpeed: 8,
        icon: 'hot'
      },
      forecast: [
        { day: 'Today', high: 33, low: 25, condition: 'Hot', icon: 'hot' },
        { day: 'Tomorrow', high: 35, low: 27, condition: 'Sunny', icon: 'sunny' },
        { day: 'Wed', high: 32, low: 24, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: 'Thu', high: 34, low: 26, condition: 'Hot', icon: 'hot' },
        { day: 'Fri', high: 36, low: 28, condition: 'Sunny', icon: 'sunny' },
        { day: 'Sat', high: 33, low: 25, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Sun', high: 31, low: 23, condition: 'Rainy', icon: 'rainy' }
      ],
      historical: [
        { day: '7 days ago', high: 32, low: 24, condition: 'Sunny', icon: 'sunny' },
        { day: '6 days ago', high: 34, low: 26, condition: 'Hot', icon: 'hot' },
        { day: '5 days ago', high: 30, low: 22, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        { day: '4 days ago', high: 33, low: 25, condition: 'Sunny', icon: 'sunny' },
        { day: '3 days ago', high: 35, low: 27, condition: 'Hot', icon: 'hot' },
        { day: '2 days ago', high: 31, low: 23, condition: 'Cloudy', icon: 'cloudy' },
        { day: 'Yesterday', high: 32, low: 24, condition: 'Sunny', icon: 'sunny' }
      ]
    }
  }
];

// Guides data
export const guides = [
  {
    id: 1,
    name: 'Kasun Perera',
    location: 'Ella, Uva Province',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviewCount: 156,
    experience: '8 years',
    specialties: ['Mountain Trekking', 'Wildlife Photography', 'Cultural Tours', 'Tea Plantation Tours'],
    languages: ['English', 'Sinhala', 'Tamil'],
    description: 'Expert mountain guide with extensive knowledge of Ella region and surrounding peaks. Specializes in sunrise treks and photography tours.',
    contact: '+94 77 123 4567',
    availability: 'Available',
    nearbyLocations: ['Ella Rock', 'Horton Plains National Park']
  },
  {
    id: 2,
    name: 'Nimal Silva',
    location: 'Nuwara Eliya, Central Province',
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviewCount: 203,
    experience: '12 years',
    specialties: ['Tea Country Tours', 'Camping Expert', 'Bird Watching', 'Highland Trekking'],
    languages: ['English', 'Sinhala', 'German'],
    description: 'Specialized in tea country adventures and high-altitude camping experiences with deep knowledge of local flora and fauna.',
    contact: '+94 77 234 5678',
    availability: 'Available',
    nearbyLocations: ['Horton Plains National Park', 'Adam\'s Peak']
  },
  {
    id: 3,
    name: 'Chaminda Fernando',
    location: 'Kandy, Central Province',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviewCount: 134,
    experience: '6 years',
    specialties: ['Cultural Tours', 'Adventure Sports', 'Historical Sites', 'Temple Tours'],
    languages: ['English', 'Sinhala', 'French'],
    description: 'Cultural heritage expert with passion for adventure sports and historical exploration around central Sri Lanka.',
    contact: '+94 77 345 6789',
    availability: 'Busy until next week',
    nearbyLocations: ['Knuckles Mountain Range', 'Sigiriya Rock Fortress']
  },
  {
    id: 4,
    name: 'Ruwan Jayasinghe',
    location: 'Dambulla, Central Province',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviewCount: 287,
    experience: '10 years',
    specialties: ['Archaeological Tours', 'Rock Climbing', 'Historical Sites', 'Photography'],
    languages: ['English', 'Sinhala', 'Japanese'],
    description: 'Archaeological expert specializing in ancient sites and rock formations with professional climbing experience.',
    contact: '+94 77 456 7890',
    availability: 'Available',
    nearbyLocations: ['Sigiriya Rock Fortress', 'Polonnaruwa Ancient City']
  }
];

// Shops data
export const shops = [
  {
    id: 1,
    name: 'Adventure Gear Lanka',
    location: 'Ella, Uva Province',
    image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Camping Equipment',
    rating: 4.6,
    reviewCount: 89,
    products: ['Tents', 'Sleeping Bags', 'Hiking Gear', 'Backpacks', 'Cooking Equipment'],
    description: 'Premier outdoor equipment store with high-quality camping and hiking gear for all your adventure needs.',
    contact: '+94 57 234 5678',
    address: '123 Main Street, Ella',
    openHours: '8:00 AM - 8:00 PM',
    nearbyLocations: ['Ella Rock', 'Horton Plains National Park']
  },
  {
    id: 2,
    name: 'Mountain Sports',
    location: 'Kandy, Central Province',
    image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Outdoor Sports',
    rating: 4.5,
    reviewCount: 67,
    products: ['Climbing Gear', 'Backpacks', 'Navigation Tools', 'Safety Equipment', 'Outdoor Clothing'],
    description: 'Specialized in mountain sports equipment and professional climbing gear with expert advice.',
    contact: '+94 81 234 5678',
    address: '45 Peradeniya Road, Kandy',
    openHours: '8:30 AM - 7:30 PM',
    nearbyLocations: ['Knuckles Mountain Range', 'Adam\'s Peak']
  },
  {
    id: 3,
    name: 'Wildlife Essentials',
    location: 'Tissamaharama, Southern Province',
    image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Safari Equipment',
    rating: 4.7,
    reviewCount: 112,
    products: ['Binoculars', 'Camera Gear', 'Safari Clothing', 'Insect Repellent', 'Field Guides'],
    description: 'Specialized safari and wildlife observation equipment store near Yala National Park.',
    contact: '+94 47 234 5678',
    address: '78 Park Road, Tissamaharama',
    openHours: '7:00 AM - 9:00 PM',
    nearbyLocations: ['Yala National Park']
  },
  {
    id: 4,
    name: 'Beach Adventure Co.',
    location: 'Mirissa, Southern Province',
    image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Water Sports',
    rating: 4.4,
    reviewCount: 95,
    products: ['Snorkeling Gear', 'Surfboards', 'Beach Equipment', 'Water Bottles', 'Sun Protection'],
    description: 'Complete water sports and beach equipment rental and sales with professional guidance.',
    contact: '+94 41 234 5678',
    address: '12 Beach Road, Mirissa',
    openHours: '6:00 AM - 10:00 PM',
    nearbyLocations: ['Mirissa Beach']
  }
];

// Vehicles data
export const vehicles = [
  {
    id: 1,
    vehicleName: 'Toyota Land Cruiser',
    ownerName: 'Sunil Bandara',
    image: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    capacity: '7 passengers',
    features: ['4WD', 'AC', 'GPS', 'First Aid Kit', 'Cooler Box', 'Phone Charger'],
    location: 'Ella, Uva Province',
    rating: 4.8,
    reviewCount: 45,
    description: 'Reliable 4WD vehicle perfect for mountain adventures and rough terrain with experienced driver.',
    contact: '+94 77 456 7890',
    availability: 'Available',
    nearbyLocations: ['Ella Rock', 'Horton Plains National Park']
  },
  {
    id: 2,
    vehicleName: 'Mitsubishi Montero',
    ownerName: 'Ravi Jayasinghe',
    image: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    capacity: '5 passengers',
    features: ['4WD', 'AC', 'Music System', 'Cooler Box', 'Phone Charger', 'WiFi Hotspot'],
    location: 'Kandy, Central Province',
    rating: 4.6,
    reviewCount: 32,
    description: 'Comfortable SUV ideal for family adventures and camping trips with local driver knowledge.',
    contact: '+94 77 567 8901',
    availability: 'Available',
    nearbyLocations: ['Knuckles Mountain Range', 'Sigiriya Rock Fortress']
  },
  {
    id: 3,
    vehicleName: 'Safari Jeep',
    ownerName: 'Mahesh Silva',
    image: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    capacity: '6 passengers',
    features: ['Open Top', '4WD', 'Binoculars', 'Field Guide', 'Water Bottles', 'Camera Mounts'],
    location: 'Tissamaharama, Southern Province',
    rating: 4.7,
    reviewCount: 28,
    description: 'Specialized safari vehicle with experienced wildlife guide for the ultimate safari experience.',
    contact: '+94 77 678 9012',
    availability: 'Available',
    nearbyLocations: ['Yala National Park']
  },
  {
    id: 4,
    vehicleName: 'Beach Buggy',
    ownerName: 'Pradeep Fernando',
    image: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    capacity: '4 passengers',
    features: ['Open Air', 'Beach Tires', 'Cooler Box', 'Beach Umbrella', 'Snorkel Gear', 'Bluetooth'],
    location: 'Mirissa, Southern Province',
    rating: 4.5,
    reviewCount: 41,
    description: 'Fun beach vehicle perfect for coastal adventures and water sports activities.',
    contact: '+94 77 789 0123',
    availability: 'Booked until next week',
    nearbyLocations: ['Mirissa Beach']
  }
];

// Hotels data
export const hotels = [
  {
    id: 1,
    name: 'Ella Jungle Resort',
    location: 'Ella, Uva Province',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    reviewCount: 234,
    amenities: ['Pool', 'Restaurant', 'Spa', 'WiFi', 'Mountain View', 'Room Service'],
    description: 'Luxury eco-resort nestled in the heart of Ella\'s lush jungle landscape with stunning mountain views.',
    contact: '+94 57 222 8888',
    address: 'Jungle Path, Ella 90090',
    checkIn: '2:00 PM',
    checkOut: '12:00 PM',
    nearbyLocations: ['Ella Rock', 'Horton Plains National Park']
  },
  {
    id: 2,
    name: 'Hill Country Lodge',
    location: 'Nuwara Eliya, Central Province',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    reviewCount: 156,
    amenities: ['Fireplace', 'Garden', 'Restaurant', 'WiFi', 'Tea Plantation View', 'Butler Service'],
    description: 'Charming colonial-style lodge with stunning tea plantation views and traditional hospitality.',
    contact: '+94 52 222 7777',
    address: 'Tea Estate Road, Nuwara Eliya 22200',
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    nearbyLocations: ['Horton Plains National Park', 'Adam\'s Peak']
  },
  {
    id: 3,
    name: 'Heritage Hotel Kandy',
    location: 'Kandy, Central Province',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    reviewCount: 189,
    amenities: ['Balcony', 'Restaurant', 'Tour Desk', 'WiFi', 'City View', 'Cultural Shows'],
    description: 'Historic hotel with panoramic mountain views and excellent service in the cultural capital.',
    contact: '+94 81 222 6666',
    address: '56 Kandy Road, Kandy 20000',
    checkIn: '2:00 PM',
    checkOut: '12:00 PM',
    nearbyLocations: ['Knuckles Mountain Range', 'Sigiriya Rock Fortress']
  },
  {
    id: 4,
    name: 'Safari Lodge Yala',
    location: 'Tissamaharama, Southern Province',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    reviewCount: 167,
    amenities: ['Pool', 'Restaurant', 'Safari Tours', 'WiFi', 'Wildlife View', 'Campfire'],
    description: 'Authentic safari lodge experience with direct access to Yala National Park and wildlife viewing.',
    contact: '+94 47 222 5555',
    address: 'Safari Road, Tissamaharama 82600',
    checkIn: '2:00 PM',
    checkOut: '11:00 AM',
    nearbyLocations: ['Yala National Park']
  },
  {
    id: 5,
    name: 'Beach Resort Mirissa',
    location: 'Mirissa, Southern Province',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    reviewCount: 298,
    amenities: ['Beach Access', 'Pool', 'Restaurant', 'WiFi', 'Ocean View', 'Water Sports'],
    description: 'Beachfront resort with direct access to pristine beaches and whale watching tours.',
    contact: '+94 41 222 4444',
    address: 'Beach Road, Mirissa 81740',
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    nearbyLocations: ['Mirissa Beach']
  }
];