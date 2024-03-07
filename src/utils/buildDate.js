import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import LocalizedFormat from 'dayjs/plugin/LocalizedFormat';

dayjs.extend(utc);
dayjs.extend(LocalizedFormat);

export const buildDate = (sec, timezone) =>
  dayjs
    .unix(sec)
    .utcOffset(timezone === 0 ? timezone : timezone / 60)
    .format('llll');
