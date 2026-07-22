
export enum UserRole {
  DONOR = 'DONOR',
  NGO = 'NGO',
  ADMIN = 'ADMIN',
  VOLUNTEER = 'VOLUNTEER'
}

export enum FoodCategory {
  COOKED = 'Cooked Meals',
  BAKERY = 'Bakery & Sweets',
  PRODUCE = 'Fresh Produce',
  PACKAGED = 'Packaged Goods',
  DAIRY = 'Dairy & Eggs'
}

export enum RecipientGroup {
  CHILDREN = 'Children',
  ELDERLY = 'Elderly',
  PREGNANT_WOMEN = 'Pregnant Women',
  GENERAL = 'General Public',
  ATHLETES = 'High Activity'
}

export interface NGORequirements {
  targetGroups: RecipientGroup[];
  priorityNutrients: string[];
  maxDistanceKm: number;
}

export enum FreshnessStatus {
  FRESH = 'Fresh',
  USE_SOON = 'Use Soon',
  URGENT = 'Urgent'
}

export enum ListingStatus {
  AVAILABLE = 'Available',
  CLAIMED = 'Claimed',
  EXPIRED = 'Expired'
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  allergens: string[];
}

export interface FoodListing {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: string;
  servings?: number; // Number of people it can serve
  donorName: string;
  donorType: 'Restaurant' | 'Hotel' | 'Event' | 'Household';
  expiryDate: string;
  preparedDate?: string; // The date the food was prepared
  cookingTime?: string; // This will be used as "Prepared Time"
  freshness: FreshnessStatus;
  status: ListingStatus;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  tags: string[];
  nutrition: NutritionInfo;
  imageUrl: string;
  createdAt: string;
  availableUntil: string;
  verified: boolean;
  targetGroups: RecipientGroup[];
  otp?: string;
  claimedBy?: string;
  claimedAt?: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorRole: UserRole;
  targetId: string;
  rating: number;
  content: string;
  date: string;
  isVerified: boolean;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  type: UserRole;
  avatar: string;
  rank: number;
}

export interface PredictiveInsight {
  type: 'TREND' | 'ALERT' | 'OPPORTUNITY';
  title: string;
  description: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}
