export const inLocaleTime = (date: Date) =>
  date.toLocaleString('en-US', timeOptions);

const timeOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'Asia/Seoul',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour12: false,
  hour: 'numeric',
  minute: 'numeric',
};
