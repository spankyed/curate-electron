function adjustDateToUserTimezone(date: Date): Date {
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset);
}

export function formatDate(dateString: Date | string): string {
  const date = new Date(dateString);
  const adjustedDate = adjustDateToUserTimezone(date);

  return adjustedDate.toISOString().split('T')[0];
}
