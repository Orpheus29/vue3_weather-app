import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const buildDate = (sec, timezone) =>
  dayjs
    .unix(sec)
    .utcOffset(timezone === 0 ? timezone : timezone / 60)
    .format('dddd, MMMM D, H:mm A');
