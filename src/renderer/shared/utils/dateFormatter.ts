function adjustDateToUserTimezone(date: Date): Date {
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset);
}

export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);
  const adjustedDate = adjustDateToUserTimezone(date);
  return adjustedDate.toLocaleDateString('en-US', options);
}

export function formatDateParts(
  dateString: string,
  options: Intl.DateTimeFormatOptions
): string[] {
  const formatted = formatDate(dateString, options);
  return formatted.split(/[,\s]+/);
}

export function getDatePrior(datesPrior: number): string {
  const priorDate = new Date(Date.now() - datesPrior * 86400000);
  return priorDate.toISOString().split('T')[0];
}

export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options);
}