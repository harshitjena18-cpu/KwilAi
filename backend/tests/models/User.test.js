import { jest } from '@jest/globals';
import User from '../../src/models/User.js';

describe('User Model', () => {
  describe('isSubscriptionActive', () => {
    it('should return true if subscription plan is free', () => {
      // Mock the instance
      const user = new User({ subscriptionPlan: 'free' });
      expect(user.isSubscriptionActive()).toBe(true);
    });

    it('should return false if subscription plan is not free and expiresAt is null', () => {
      const user = new User({ subscriptionPlan: 'premium', subscriptionExpiresAt: null });
      expect(user.isSubscriptionActive()).toBe(false);
    });

    it('should return false if subscription plan is not free and expiresAt is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Yesterday

      const user = new User({
        subscriptionPlan: 'premium',
        subscriptionExpiresAt: pastDate
      });
      expect(user.isSubscriptionActive()).toBe(false);
    });

    it('should return true if subscription plan is not free and expiresAt is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Tomorrow

      const user = new User({
        subscriptionPlan: 'premium',
        subscriptionExpiresAt: futureDate
      });
      expect(user.isSubscriptionActive()).toBe(true);
    });
  });

  describe('hasPremiumAccess', () => {
    it('should return false if subscription plan is free', () => {
      const user = new User({ subscriptionPlan: 'free' });
      expect(user.hasPremiumAccess()).toBe(false);
    });

    it('should return false if subscription plan is basic', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const user = new User({
        subscriptionPlan: 'basic',
        subscriptionExpiresAt: futureDate
      });
      expect(user.hasPremiumAccess()).toBe(false);
    });

    it('should return false if subscription plan is premium but expired', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const user = new User({
        subscriptionPlan: 'premium',
        subscriptionExpiresAt: pastDate
      });
      expect(user.hasPremiumAccess()).toBe(false);
    });

    it('should return true if subscription plan is premium and active', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const user = new User({
        subscriptionPlan: 'premium',
        subscriptionExpiresAt: futureDate
      });
      expect(user.hasPremiumAccess()).toBe(true);
    });

    it('should return true if subscription plan is enterprise and active', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const user = new User({
        subscriptionPlan: 'enterprise',
        subscriptionExpiresAt: futureDate
      });
      expect(user.hasPremiumAccess()).toBe(true);
    });
  });
});
