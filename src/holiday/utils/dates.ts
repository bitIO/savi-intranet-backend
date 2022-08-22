import { addDays, differenceInBusinessDays } from 'date-fns';

function countBusinessDays(start: Date, end: Date) {
  return differenceInBusinessDays(addDays(end, 1), start);
}

function calculateRemainingDays(now: Date = new Date()) {
  const currentMonth = now.getMonth();
  const expiredDays = Math.ceil(currentMonth * 1.8);

  return 22 - expiredDays;
}
export { countBusinessDays, calculateRemainingDays };
