import mongoose from 'mongoose';
import { Location } from '../models/Location';
import { logger } from '../utils/logger';

const sriperumbudurLocations = [
  // Religious Sites
  {
    name: 'Vallakottai Murugan Temple',
    nameTranslations: {
      ta: 'வல்லக்கோட்டை முருகன் கோயில்',
      hi: 'वल्लकोट्टई मुरुगन मंदिर',
    },
    description:
      'Ancient 9th-century temple dedicated to Lord Murugan, recently renovated with Maha Kumbhabhishekam. One of the Arupadai Veedu (six abodes) of Lord Murugan, featuring intricate Dravidian architecture and spiritual significance for devotees seeking blessings for courage and wisdom.',
    descriptionTranslations: {
      ta: 'லார்ட் முருகனுக்கு அர்ப்பணிக்கப்பட்ட பழமையான 9ஆம் நூற்றாண்டு கோயில்',
    },
    category: 'temple',
    subcategory: 'hindu_temple',
    location: {
      type: 'Point',
      coordinates: [79.9256, 12.9675],
    },
    address: {
      street: 'Vallakottai, Sriperumbudur',
      city: 'Sriperumbudur',
      state: 'Tamil Nadu',
      pincode: '602105',
      country: 'India',
    },
    contact: {
      phone: '+91-44-2763XXXX',
      website: 'https://vallakottaitemple.tn.gov.in',
    },
    operatingHours: {
      monday: { open: '06:00', close: '20:00', closed: false },
      tuesday: { open: '06:00', close: '20:00', closed: false },
      wednesday: { open: '06:00', close: '20:00', closed: false },
      thursday: { open: '06:00', close: '20:00', closed: false },
      friday: { open: '06:00', close: '20:00', closed: false },
      saturday: { open: '05:30', close: '21:00', closed: false },
      sunday: { open: '05:30', close: '21:00', closed: false },
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true,
      restRooms: true,
      guidedTours: true,
    },
    images: [
      'https://images.unsplash.com/photo-1561361058-e1c1f38c938d',
      'https://images.unsplash.com/photo-1578490057216-f69104fbf402',
    ],
    rating: 4.7,
    reviewCount: 9600,
    visitDuration: 120,
    priceRange: 'free',
    tags: ['temple', 'religious', 'architecture', 'heritage', 'murugan', '9th_century'],
    rituals: [
      {
        name: 'Abhishekam',
        time: '07:00 AM',
        description: 'Sacred bathing ceremony of the deity',
      },
      {
        name: 'Kala Santhi',
        time: '06:00 AM',
        description: 'Morning prayer ceremony',
      },
      {
        name: 'Evening Aarti',
        time: '06:30 PM',
        description: 'Evening devotional ceremony with lamps',
      },
    ],
    history:
      'Built in the 9th century during the Chola dynasty, this temple has undergone recent renovations including the Maha Kumbhabhishekam. The temple is mentioned in ancient Tamil literature and has been a center of worship for over 1100 years.',
    architecture:
      'Classic Dravidian architecture with a towering gopuram (gateway tower), ornate pillars depicting mythological scenes, and intricate sculptures of deities and celestial beings.',
    significance:
      'One of the six abodes (Arupadai Veedu) of Lord Murugan, representing the site where he rested after defeating demons. Special significance for those seeking courage, victory, and spiritual wisdom.',
    bestTimeToVisit: 'Early morning (6:00-8:00 AM) or during festival times. Weekdays are less crowded.',
    tips: [
      'Remove footwear before entering temple premises',
      'Dress modestly - traditional Indian attire preferred',
      'Photography allowed in outer areas only',
      'Prasad (blessed food) available at designated counters',
      'Footwear deposit service available',
    ],
  },
  // Monuments
  {
    name: 'Rajiv Gandhi Memorial',
    nameTranslations: {
      ta: 'ராஜீவ் காந்தி நினைவிடம்',
      hi: 'राजीव गांधी स्मारक',
    },
    description:
      'National memorial at the site where former Prime Minister Rajiv Gandhi was assassinated in 1991. Features seven granite pillars representing unity in diversity and a lotus-shaped platform symbolizing peace.',
    category: 'monument',
    subcategory: 'memorial',
    location: {
      type: 'Point',
      coordinates: [79.9533, 12.9679],
    },
    address: {
      street: 'Sriperumbudur Main Road',
      city: 'Sriperumbudur',
      state: 'Tamil Nadu',
      pincode: '602105',
      country: 'India',
    },
    contact: {
      phone: '+91-44-2717XXXX',
      website: 'https://www.rajivgandhimemorial.org',
    },
    operatingHours: {
      monday: { open: '10:00', close: '17:00', closed: false },
      tuesday: { open: '10:00', close: '17:00', closed: false },
      wednesday: { open: '10:00', close: '17:00', closed: false },
      thursday: { open: '10:00', close: '17:00', closed: false },
      friday: { open: '10:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '17:00', closed: false },
      sunday: { open: '10:00', close: '17:00', closed: false },
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true,
      restRooms: true,
      guidedTours: true,
    },
    images: [
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1',
      'https://images.unsplash.com/photo-1578902494927-e5e4f27c9d9e',
    ],
    rating: 4.3,
    reviewCount: 7000,
    visitDuration: 60,
    priceRange: 'free',
    entryFee: 0,
    tags: ['memorial', 'history', 'monument', 'rajiv_gandhi', 'national_memorial'],
    history:
      'Built at the exact spot where former Prime Minister Rajiv Gandhi was assassinated on May 21, 1991. The memorial was inaugurated in 2003 and serves as a place of reflection and remembrance.',
    architecture:
      'Seven granite pillars represent the seven major language groups of India, symbolizing unity in diversity. The central platform is shaped like a lotus, representing peace and spirituality.',
    significance:
      'National memorial commemorating the life and sacrifice of Rajiv Gandhi. Important site for understanding modern Indian history and the evolution of democracy.',
    bestTimeToVisit: 'Weekday mornings to avoid crowds. Photography allowed.',
    tips: [
      'Entry is free for all visitors',
      'Maintain silence in the memorial area',
      'Museum section contains photographs and artifacts',
      'Audio guide available at entrance',
    ],
  },
  // Industrial
  {
    name: 'Hyundai Motor India Factory',
    nameTranslations: {
      ta: 'ஹூண்டாய் மோட்டார் இந்தியா தொழிற்சாலை',
    },
    description:
      'One of Indias largest automotive manufacturing facilities. Offers factory tours showcasing advanced manufacturing processes and quality standards.',
    category: 'industrial',
    subcategory: 'automotive',
    location: {
      type: 'Point',
      coordinates: [79.9742, 12.9833],
    },
    address: {
      street: 'Irrungattukottai, Sriperumbudur',
      city: 'Sriperumbudur',
      state: 'Tamil Nadu',
      pincode: '602105',
      country: 'India',
    },
    contact: {
      phone: '+91-44-2760XXXX',
      website: 'https://www.hyundai.com/in',
    },
    operatingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '', close: '', closed: true },
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: false,
      restRooms: true,
      guidedTours: true,
    },
    images: [
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492',
    ],
    rating: 4.2,
    reviewCount: 1500,
    visitDuration: 90,
    priceRange: 'low',
    entryFee: 50,
    tags: ['industrial', 'automotive', 'factory_tour', 'manufacturing', 'hyundai'],
    tips: [
      'Advance booking required for factory tours',
      'Safety equipment provided',
      'No photography inside factory floor',
      'Minimum age: 12 years',
    ],
  },
  // Nature
  {
    name: 'Sriperumbudur Lake',
    nameTranslations: {
      ta: 'ஸ்ரீபெரும்புதூர் ஏரி',
    },
    description:
      'Serene freshwater lake popular for bird watching and evening walks. Home to various migratory birds during winter months.',
    category: 'nature',
    subcategory: 'lake',
    location: {
      type: 'Point',
      coordinates: [79.9456, 12.9589],
    },
    address: {
      street: 'Near Sriperumbudur Town',
      city: 'Sriperumbudur',
      state: 'Tamil Nadu',
      pincode: '602105',
      country: 'India',
    },
    operatingHours: {
      monday: { open: '06:00', close: '18:00', closed: false },
      tuesday: { open: '06:00', close: '18:00', closed: false },
      wednesday: { open: '06:00', close: '18:00', closed: false },
      thursday: { open: '06:00', close: '18:00', closed: false },
      friday: { open: '06:00', close: '18:00', closed: false },
      saturday: { open: '06:00', close: '18:00', closed: false },
      sunday: { open: '06:00', close: '18:00', closed: false },
    },
    accessibility: {
      wheelchairAccessible: false,
      parkingAvailable: true,
      publicTransport: false,
      restRooms: false,
      guidedTours: false,
    },
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    ],
    rating: 4.0,
    reviewCount: 800,
    visitDuration: 45,
    priceRange: 'free',
    tags: ['nature', 'lake', 'bird_watching', 'sunset', 'photography'],
    bestTimeToVisit: 'Early morning for bird watching, evening for sunset views',
    tips: [
      'Best visited during winter for migratory birds',
      'Carry binoculars for bird watching',
      'No food stalls nearby',
      'Mosquito repellent recommended',
    ],
  },
  // Food
  {
    name: 'Sri Krishna Bhavan',
    nameTranslations: {
      ta: 'ஸ்ரீ கிருஷ்ணா பவன்',
    },
    description:
      'Authentic South Indian vegetarian restaurant serving traditional Tamil Nadu cuisine. Known for dosas, idlis, and filter coffee.',
    category: 'food',
    subcategory: 'restaurant',
    location: {
      type: 'Point',
      coordinates: [79.9523, 12.9701],
    },
    address: {
      street: 'Main Road, Near Bus Stand',
      city: 'Sriperumbudur',
      state: 'Tamil Nadu',
      pincode: '602105',
      country: 'India',
    },
    contact: {
      phone: '+91-44-2763XXXX',
    },
    operatingHours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '06:00', close: '22:00', closed: false },
      sunday: { open: '06:00', close: '22:00', closed: false },
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true,
      restRooms: true,
      guidedTours: false,
    },
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    ],
    rating: 4.4,
    reviewCount: 2500,
    visitDuration: 45,
    priceRange: 'low',
    tags: ['food', 'vegetarian', 'south_indian', 'breakfast', 'local_cuisine'],
    tips: [
      'Try the filter coffee',
      'Breakfast hours are busiest',
      'Cash and UPI payments accepted',
      'Family-friendly environment',
    ],
  },
  // More locations...
  {
    name: 'Thirumazhisai Temple',
    nameTranslations: {
      ta: 'திருமழிசை கோயில்',
    },
    description:
      'Ancient temple dedicated to Lord Shiva, known for its association with the saint Thirumazhisai Alwar.',
    category: 'temple',
    subcategory: 'hindu_temple',
    location: {
      type: 'Point',
      coordinates: [80.0589, 13.0589],
    },
    address: {
      street: 'Thirumazhisai',
      city: 'Sriperumbudur',
      state: 'Tamil Nadu',
      pincode: '602107',
      country: 'India',
    },
    operatingHours: {
      monday: { open: '06:00', close: '12:00', closed: false },
      tuesday: { open: '06:00', close: '12:00', closed: false },
      wednesday: { open: '06:00', close: '12:00', closed: false },
      thursday: { open: '06:00', close: '12:00', closed: false },
      friday: { open: '06:00', close: '12:00', closed: false },
      saturday: { open: '06:00', close: '12:00', closed: false },
      sunday: { open: '06:00', close: '12:00', closed: false },
    },
    accessibility: {
      wheelchairAccessible: false,
      parkingAvailable: true,
      publicTransport: true,
      restRooms: true,
      guidedTours: true,
    },
    images: [
      'https://images.unsplash.com/photo-1561361058-e1c1f38c938d',
    ],
    rating: 4.5,
    reviewCount: 1200,
    visitDuration: 90,
    priceRange: 'free',
    tags: ['temple', 'shiva', 'heritage', 'vaishnavism', 'alwar'],
  },
  {
    name: 'Sriperumbudur Bus Terminal',
    nameTranslations: {
      ta: 'ஸ்ரீபெரும்புதூர் பேருந்து நிலையம்',
    },
    description:
      'Main transportation hub connecting Sriperumbudur to Chennai, Bangalore, and other major cities.',
    category: 'cultural',
    subcategory: 'transport',
    location: {
      type: 'Point',
      coordinates: [79.9512, 12.9689],
    },
    address: {
      street: 'GST Road',
      city: 'Sriperumbudur',
      state: 'Tamil Nadu',
      pincode: '602105',
      country: 'India',
    },
    operatingHours: {
      monday: { open: '00:00', close: '23:59', closed: false },
      tuesday: { open: '00:00', close: '23:59', closed: false },
      wednesday: { open: '00:00', close: '23:59', closed: false },
      thursday: { open: '00:00', close: '23:59', closed: false },
      friday: { open: '00:00', close: '23:59', closed: false },
      saturday: { open: '00:00', close: '23:59', closed: false },
      sunday: { open: '00:00', close: '23:59', closed: false },
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true,
      restRooms: true,
      guidedTours: false,
    },
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    ],
    rating: 3.8,
    reviewCount: 500,
    visitDuration: 15,
    priceRange: 'free',
    tags: ['transport', 'bus_stand', 'connectivity'],
  },
];

const seedLocations = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-tourist-guide';
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing locations
    await Location.deleteMany({});
    logger.info('Cleared existing locations');

    // Insert new locations
    const inserted = await Location.insertMany(sriperumbudurLocations);
    logger.info(`Seeded ${inserted.length} locations`);

    // Create nearby attractions relationships
    for (const loc of inserted) {
      if (loc.name === 'Vallakottai Murugan Temple') {
        const nearby = inserted.find((l) => l.name === 'Thirumazhisai Temple');
        if (nearby) {
          loc.nearbyAttractions = [nearby._id];
          await loc.save();
        }
      }
    }

    logger.info('Created nearby attraction relationships');
    logger.info('Seed completed successfully');
  } catch (error) {
    logger.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedLocations();
