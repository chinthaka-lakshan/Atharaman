export const guides = [
  {
    id: 1,
    name: "Sarah Mountain",
    image: "https://images.pexels.com/photos/1130623/pexels-photo-1130623.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Rocky Mountains",
    description: "Expert mountain climbing guide with 15 years of experience",
    bio: "Passionate about outdoor adventures and helping others discover the beauty of nature. Specializes in rock climbing, hiking, and wilderness survival.",
    contact: "sarah@mountainguides.com",
    rating: 4.9,
    experience: "15 years"
  },
  {
    id: 2,
    name: "Mike Forest",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Pacific Northwest",
    description: "Wilderness survival expert and hiking guide",
    bio: "Former park ranger turned professional guide. Expert in forest navigation, wildlife tracking, and outdoor safety.",
    contact: "mike@forestadventures.com",
    rating: 4.8,
    experience: "12 years"
  },
  {
    id: 3,
    name: "Elena Canyon",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Grand Canyon",
    description: "Canyon exploration and photography guide",
    bio: "Professional photographer and adventure guide specializing in desert landscapes and canyon expeditions.",
    rating: 4.7,
    experience: "10 years"
  },
  {
    id: 4,
    name: "Alex Rivers",
    image: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Colorado River",
    description: "White water rafting and river guide expert",
    bio: "Certified river guide with extensive experience in white water rafting and river safety.",
    contact: "alex@riveradventures.com",
    rating: 4.9,
    experience: "8 years"
  }
];

export const hotels = [
  {
    id: 1,
    name: "Mountain Vista Lodge",
    images: [
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Luxury lodge with breathtaking mountain views and world-class amenities",
    location: "Rocky Mountains",
    pricePerNight: 250,
    ownerName: "Robert Chen",
    ownerContact: "robert@mountainvista.com",
    rating: 4.8,
    amenities: ["Spa", "Restaurant", "Hiking Trails", "Fireplace", "WiFi"]
  },
  {
    id: 2,
    name: "Forest Cabin Retreat",
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Cozy cabins nestled in the heart of the forest",
    location: "Pacific Northwest",
    pricePerNight: 180,
    ownerName: "Maria Rodriguez",
    rating: 4.6,
    amenities: ["Kitchen", "Fireplace", "Hot Tub", "Pet Friendly"]
  },
  {
    id: 3,
    name: "Desert Oasis Resort",
    images: [
      "https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Unique desert experience with modern comfort",
    location: "Grand Canyon",
    pricePerNight: 320,
    ownerName: "David Wilson",
    ownerContact: "david@desertoasis.com",
    rating: 4.9,
    amenities: ["Pool", "Restaurant", "Spa", "Tours", "WiFi", "Gym"]
  }
];

export const shops = [
  {
    id: 1,
    name: "Adventure Gear Co",
    description: "Premium camping and hiking equipment for serious adventurers",
    location: "Rocky Mountains",
    ownerName: "Tom Anderson",
    ownerContact: "tom@adventuregear.com",
    rating: 4.7,
    items: [
      {
        id: 1,
        name: "Professional Tent",
        image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "4-season waterproof tent for 2-3 people",
        price: 299
      },
      {
        id: 2,
        name: "Hiking Backpack",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "50L capacity with hydration system",
        price: 159
      },
      {
        id: 3,
        name: "Sleeping Bag",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Ultra-light sleeping bag rated to -10°C",
        price: 199
      }
    ]
  },
  {
    id: 2,
    name: "Outdoor Essentials",
    description: "Everything you need for your next outdoor adventure",
    location: "Pacific Northwest",
    ownerName: "Lisa Thompson",
    rating: 4.5,
    items: [
      {
        id: 4,
        name: "Camping Stove",
        image: "https://images.pexels.com/photos/1687670/pexels-photo-1687670.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Portable gas stove with wind shield",
        price: 79
      },
      {
        id: 5,
        name: "Water Filter",
        image: "https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Portable water purification system",
        price: 45
      }
    ]
  },
  {
    id: 3,
    name: "Adventure Gear Co",
    description: "Premium camping and hiking equipment for serious adventurers",
    location: "Rocky Mountains",
    ownerName: "Tom Anderson",
    ownerContact: "tom@adventuregear.com",
    rating: 4.7,
    items: [
      {
        id: 6,
        name: "Professional Tent",
        image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "4-season waterproof tent for 2-3 people",
        price: 299
      },
      {
        id: 7,
        name: "Hiking Backpack",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "50L capacity with hydration system",
        price: 159
      },
      {
        id: 8,
        name: "Sleeping Bag",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Ultra-light sleeping bag rated to -10°C",
        price: 199
      }
    ]
  },
  {
    id: 4,
    name: "Adventure Gear Co",
    description: "Premium camping and hiking equipment for serious adventurers",
    location: "Rocky Mountains",
    ownerName: "Tom Anderson",
    ownerContact: "tom@adventuregear.com",
    rating: 4.7,
    items: [
      {
        id: 9,
        name: "Professional Tent",
        image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "4-season waterproof tent for 2-3 people",
        price: 299
      },
      {
        id: 10,
        name: "Hiking Backpack",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "50L capacity with hydration system",
        price: 159
      },
      {
        id: 11,
        name: "Sleeping Bag",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Ultra-light sleeping bag rated to -10°C",
        price: 199
      }
    ]
  },
  {
    id: 5,
    name: "Adventure Gear Co",
    description: "Premium camping and hiking equipment for serious adventurers",
    location: "Rocky Mountains",
    ownerName: "Tom Anderson",
    ownerContact: "tom@adventuregear.com",
    rating: 4.7,
    items: [
      {
        id: 12,
        name: "Professional Tent",
        image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "4-season waterproof tent for 2-3 people",
        price: 299
      },
      {
        id: 13,
        name: "Hiking Backpack",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "50L capacity with hydration system",
        price: 159
      },
      {
        id: 14,
        name: "Sleeping Bag",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Ultra-light sleeping bag rated to -10°C",
        price: 199
      }
    ]
  },
  {
    id: 6,
    name: "Adventure Gear Co",
    description: "Premium camping and hiking equipment for serious adventurers",
    location: "Rocky Mountains",
    ownerName: "Tom Anderson",
    ownerContact: "tom@adventuregear.com",
    rating: 4.7,
    items: [
      {
        id: 15,
        name: "Professional Tent",
        image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "4-season waterproof tent for 2-3 people",
        price: 299
      },
      {
        id: 16,
        name: "Hiking Backpack",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "50L capacity with hydration system",
        price: 159
      },
      {
        id: 17,
        name: "Sleeping Bag",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Ultra-light sleeping bag rated to -10°C",
        price: 199
      }
    ]
  },
  {
    id: 7,
    name: "Adventure Gear Co",
    description: "Premium camping and hiking equipment for serious adventurers",
    location: "Rocky Mountains",
    ownerName: "Tom Anderson",
    ownerContact: "tom@adventuregear.com",
    rating: 4.7,
    items: [
      {
        id: 18,
        name: "Professional Tent",
        image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "4-season waterproof tent for 2-3 people",
        price: 299
      },
      {
        id: 19,
        name: "Hiking Backpack",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "50L capacity with hydration system",
        price: 159
      },
      {
        id: 20,
        name: "Sleeping Bag",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Ultra-light sleeping bag rated to -10°C",
        price: 199
      }
    ]
  },
  {
    id: 8,
    name: "Adventure Gear Co",
    description: "Premium camping and hiking equipment for serious adventurers",
    location: "Rocky Mountains",
    ownerName: "Tom Anderson",
    ownerContact: "tom@adventuregear.com",
    rating: 4.7,
    items: [
      {
        id: 21,
        name: "Professional Tent",
        image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "4-season waterproof tent for 2-3 people",
        price: 299
      },
      {
        id: 22,
        name: "Hiking Backpack",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "50L capacity with hydration system",
        price: 159
      },
      {
        id: 23,
        name: "Sleeping Bag",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Ultra-light sleeping bag rated to -10°C",
        price: 199
      }
    ]
  },
  {
    id: 9,
    name: "Adventure Gear Co",
    description: "Premium camping and hiking equipment for serious adventurers",
    location: "Rocky Mountains",
    ownerName: "Tom Anderson",
    ownerContact: "tom@adventuregear.com",
    rating: 4.7,
    items: [
      {
        id: 24,
        name: "Professional Tent",
        image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "4-season waterproof tent for 2-3 people",
        price: 299
      },
      {
        id: 25,
        name: "Hiking Backpack",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "50L capacity with hydration system",
        price: 159
      },
      {
        id: 26,
        name: "Sleeping Bag",
        image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Ultra-light sleeping bag rated to -10°C",
        price: 199
      }
    ]
  }
];

export const vehicles = [
  {
    id: 1,
    name: "Adventure RV Deluxe",
    images: [
      "https://images.pexels.com/photos/1906794/pexels-photo-1906794.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2437297/pexels-photo-2437297.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Spacious RV perfect for family camping trips with full amenities",
    location: "Rocky Mountains",
    pricePerDay: 120,
    mileage: "18 MPG",
    withDriver: false,
    ownerName: "John Stevens",
    ownerContact: "john@adventurerv.com",
    rating: 4.8,
    type: "RV"
  },
  {
    id: 2,
    name: "Off-Road Jeep Wrangler",
    images: [
      "https://images.pexels.com/photos/1319839/pexels-photo-1319839.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Rugged 4x4 vehicle for extreme terrain adventures",
    location: "Grand Canyon",
    pricePerDay: 85,
    mileage: "22 MPG",
    withDriver: true,
    ownerName: "Carlos Martinez",
    ownerContact: "carlos@offroadadventures.com",
    rating: 4.9,
    type: "SUV"
  },
  {
    id: 3,
    name: "Camping Van Classic",
    images: [
      "https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1787318/pexels-photo-1787318.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Vintage-style camping van with modern conveniences",
    location: "Pacific Northwest",
    pricePerDay: 95,
    mileage: "25 MPG",
    withDriver: false,
    ownerName: "Emma Johnson",
    ownerContact: "emma@classicvans.com",
    rating: 4.6,
    type: "Van"
  }
];

export const locations = [
  "All Locations",
  "Rocky Mountains",
  "Pacific Northwest", 
  "Grand Canyon",
  "Colorado River"
];
