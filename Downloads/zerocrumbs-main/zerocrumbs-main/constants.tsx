
import { FoodCategory, FreshnessStatus, FoodListing, ListingStatus, Review, LeaderboardEntry, UserRole, RecipientGroup } from './types';

export const MOCK_LISTINGS: FoodListing[] = [
  {
    id: '1',
    name: 'Gourmet Vegetable Lasagna',
    category: FoodCategory.COOKED,
    quantity: '12 Large Servings',
    servings: 12,
    donorName: 'Olive Garden Bistro',
    donorType: 'Restaurant',
    status: ListingStatus.AVAILABLE,
    expiryDate: '2025-05-20',
    preparedDate: '2025-05-18',
    cookingTime: '45 mins',
    freshness: FreshnessStatus.URGENT,
    location: { address: '452 Broadway, NY', lat: 40.7128, lng: -74.0060 },
    tags: ['Veg', 'Contains Dairy'],
    nutrition: { calories: 380, protein: 18, carbs: 45, fats: 14, allergens: ['Dairy', 'Gluten'] },
    imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    availableUntil: 'Today 10:00 PM',
    verified: true,
    targetGroups: [RecipientGroup.GENERAL, RecipientGroup.CHILDREN, RecipientGroup.PREGNANT_WOMEN]
  },
  {
    id: '2',
    name: 'Assorted Sourdough Loaves',
    category: FoodCategory.BAKERY,
    quantity: '8 Loaves',
    servings: 16,
    donorName: 'Hearth & Stone Bakery',
    donorType: 'Restaurant',
    status: ListingStatus.AVAILABLE,
    expiryDate: '2025-05-22',
    preparedDate: '2025-05-20',
    cookingTime: '120 mins',
    freshness: FreshnessStatus.FRESH,
    location: { address: '12 Bakery Ln, Brooklyn', lat: 40.7306, lng: -73.9352 },
    tags: ['Vegan', 'Soy-Free'],
    nutrition: { calories: 220, protein: 8, carbs: 40, fats: 2, allergens: ['Gluten'] },
    imageUrl: 'https://images.unsplash.com/photo-1585478259715-876a6a81b494?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    availableUntil: 'Tomorrow 9:00 AM',
    verified: true,
    targetGroups: [RecipientGroup.GENERAL, RecipientGroup.ELDERLY]
  },
  {
    id: '3',
    name: 'Fresh Garden Salad Mix',
    category: FoodCategory.PRODUCE,
    quantity: '5 Large Bowls',
    servings: 25,
    donorName: 'Green Leaf Hotel',
    donorType: 'Hotel',
    status: ListingStatus.AVAILABLE,
    expiryDate: '2025-05-21',
    preparedDate: '2025-05-20',
    cookingTime: '15 mins',
    freshness: FreshnessStatus.USE_SOON,
    location: { address: 'Grand Central Plaza', lat: 40.7589, lng: -73.9851 },
    tags: ['Vegan', 'Gluten-Free'],
    nutrition: { calories: 120, protein: 4, carbs: 12, fats: 6, allergens: [] },
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    availableUntil: 'Today 11:30 PM',
    verified: true,
    targetGroups: [RecipientGroup.GENERAL, RecipientGroup.PREGNANT_WOMEN, RecipientGroup.CHILDREN]
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    authorName: 'City Harvest NGO',
    authorRole: UserRole.NGO,
    targetId: 'Olive Garden Bistro',
    rating: 5,
    content: "The vegetable lasagna was perfectly packed and still warm when we arrived. Incredible quality that fed 15 people in our shelter.",
    date: '2 days ago',
    isVerified: true
  },
  {
    id: 'r2',
    authorName: 'Hearth & Stone Bakery',
    authorRole: UserRole.DONOR,
    targetId: 'Community Kitchen NY',
    rating: 5,
    content: "The NGO team arrived precisely on time and were very professional. We love working with them to ensure our bread finds a good home.",
    date: '1 week ago',
    isVerified: true
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Grand Plaza Hotel', score: 1240, type: UserRole.DONOR, avatar: 'https://i.pravatar.cc/150?u=hotel1' },
  { rank: 2, name: 'Olive Garden Bistro', score: 980, type: UserRole.DONOR, avatar: 'https://i.pravatar.cc/150?u=bistro2' },
  { rank: 3, name: 'Hearth & Stone', score: 750, type: UserRole.DONOR, avatar: 'https://i.pravatar.cc/150?u=bakery3' },
  { rank: 1, name: 'City Harvest NGO', score: 2500, type: UserRole.NGO, avatar: 'https://i.pravatar.cc/150?u=ngo1' },
  { rank: 2, name: 'Shelter Hope', score: 1800, type: UserRole.NGO, avatar: 'https://i.pravatar.cc/150?u=ngo2' },
];

export const IMPACT_MOCK = {
  mealsSaved: 14280,
  co2Reduced: 3840,
  waterSaved: 920000,
  peopleServed: 5600
};
