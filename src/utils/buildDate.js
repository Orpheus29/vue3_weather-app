import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(localizedFormat);

export const buildDate = (sec, timezone) =>
  dayjs
    .unix(sec)
    .utcOffset(timezone === 0 ? timezone : timezone / 60)
    .format('llll');
