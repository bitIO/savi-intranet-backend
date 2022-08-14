import { addDays, differenceInBusinessDays } from 'date-fns';

function countBusinessDays(start: Date, end: Date) {
  return differenceInBusinessDays(addDays(end, 1), start);
}

export { countBusinessDays };
