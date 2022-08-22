import { nextFriday, nextMonday, nextTuesday } from 'date-fns';
import { calculateRemainingDays, countBusinessDays } from './dates';

describe('Util - Dates', () => {
  describe('calculate business days', () => {
    it('should calculate 1 day - taking the monday off', () => {
      const start = nextMonday(new Date());
      const businessDays = countBusinessDays(start, start);
      expect(businessDays).toEqual(1);
    });
    it('should calculate 2 day - taking monday and tuesday off', () => {
      const start = nextMonday(new Date());
      const end = nextTuesday(start);
      const businessDays = countBusinessDays(start, end);
      expect(businessDays).toEqual(2);
    });
    it('should calculate 5 day - taking the week', () => {
      const start = nextMonday(new Date());
      const end = nextFriday(start);
      const businessDays = countBusinessDays(start, end);
      expect(businessDays).toEqual(5);
    });
    it('should calculate 10 day - taking two weeks', () => {
      const start = nextMonday(new Date());
      const end = nextFriday(nextFriday(start));
      const businessDays = countBusinessDays(start, end);
      expect(businessDays).toEqual(10);
    });
  });

  describe('calculate remaining days', () => {
    it('should calculate 22 remaining days', () => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(0);
      const remainingDays = calculateRemainingDays(date);
      expect(remainingDays).toEqual(22);
    });
    it('should calculate 20 remaining days', () => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(1);
      const remainingDays = calculateRemainingDays(date);
      expect(remainingDays).toEqual(20);
    });
    it('should calculate 2 remaining days', () => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(11);
      const remainingDays = calculateRemainingDays(date);
      expect(remainingDays).toEqual(2);
    });
  });
});
