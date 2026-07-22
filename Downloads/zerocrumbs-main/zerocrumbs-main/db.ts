
import { FoodListing, Review, UserRole, ListingStatus } from './types';
import { MOCK_LISTINGS, MOCK_REVIEWS, IMPACT_MOCK } from './constants';

const DB_KEYS = {
  LISTINGS: 'zerocrumbs_listings',
  REVIEWS: 'zerocrumbs_reviews',
  IMPACT: 'zerocrumbs_impact',
  HEALTH_CHECK: 'zerocrumbs_health_last_ping'
};

/**
 * Robust Database Service
 * Mimics an asynchronous API connection to a real-world database.
 */
export const db = {
  /**
   * Diagnostic: Check if the database engine is responsive.
   * In a real app, this would ping a /health endpoint.
   */
  async checkConnection(): Promise<{ status: 'connected' | 'error'; latency: number; engine: string }> {
    const start = performance.now();
    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Test Write/Read
      const timestamp = new Date().toISOString();
      localStorage.setItem(DB_KEYS.HEALTH_CHECK, timestamp);
      const verify = localStorage.getItem(DB_KEYS.HEALTH_CHECK);
      
      const end = performance.now();
      if (verify !== timestamp) throw new Error('Storage verification failed');
      
      return { 
        status: 'connected', 
        latency: Math.round(end - start),
        engine: 'LocalStorage Persistence Engine' 
      };
    } catch (e) {
      return { status: 'error', latency: 0, engine: 'None' };
    }
  },

  // --- Listings ---
  async getListings(): Promise<FoodListing[]> {
    const data = localStorage.getItem(DB_KEYS.LISTINGS);
    if (!data) {
      await this.saveListings(MOCK_LISTINGS);
      return MOCK_LISTINGS;
    }
    return JSON.parse(data);
  },

  async saveListings(listings: FoodListing[]): Promise<void> {
    localStorage.setItem(DB_KEYS.LISTINGS, JSON.stringify(listings));
  },

  async addListing(listing: FoodListing): Promise<void> {
    const listings = await this.getListings();
    listings.unshift(listing);
    await this.saveListings(listings);
  },

  async updateListing(id: string, updates: Partial<FoodListing>): Promise<FoodListing> {
    const listings = await this.getListings();
    const index = listings.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Listing not found');
    
    listings[index] = { ...listings[index], ...updates };
    await this.saveListings(listings);
    return listings[index];
  },

  // --- Reviews ---
  async getReviews(): Promise<Review[]> {
    const data = localStorage.getItem(DB_KEYS.REVIEWS);
    if (!data) {
      await this.saveReviews(MOCK_REVIEWS);
      return MOCK_REVIEWS;
    }
    return JSON.parse(data);
  },

  async saveReviews(reviews: Review[]): Promise<void> {
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(reviews));
  },

  async addReview(review: Review): Promise<void> {
    const reviews = await this.getReviews();
    reviews.unshift(review);
    await this.saveReviews(reviews);
  },

  // --- Impact Stats ---
  async getImpact(): Promise<typeof IMPACT_MOCK> {
    const data = localStorage.getItem(DB_KEYS.IMPACT);
    if (!data) {
      await this.saveImpact(IMPACT_MOCK);
      return IMPACT_MOCK;
    }
    return JSON.parse(data);
  },

  async saveImpact(impact: typeof IMPACT_MOCK): Promise<void> {
    localStorage.setItem(DB_KEYS.IMPACT, JSON.stringify(impact));
  },

  async incrementMealsSaved(count: number): Promise<void> {
    const impact = await this.getImpact();
    impact.mealsSaved += count;
    await this.saveImpact(impact);
  }
};
