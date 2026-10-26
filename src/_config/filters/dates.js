const longDate = new Intl.DateTimeFormat('pl-PL', {dateStyle: 'long', timeZone: 'UTC'});

/** Formats a date for display, e.g. "30 grudnia 2025". */
export const formatDate = date => longDate.format(date);
