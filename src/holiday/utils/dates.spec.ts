import { nextFriday, nextMonday, nextTuesday } from 'date-fns';
import { countBusinessDays } from './dates';

describe('Util - Dates', () => {
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
