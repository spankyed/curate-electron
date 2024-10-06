import type { DateRecord } from "../../shared/types";

type DatesByMonth = {
  month: string;
  dates: DateRecord[];
};

function groupDatesByMonth(dates: DateRecord[]): DatesByMonth[] {
  const grouped: { [key: string]: DateRecord[] } = {};

  for (const nextDate of dates) {
    const date = new Date(`${nextDate.value}T00:00:00Z`);
    // const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(nextDate);
  }

  const result: DatesByMonth[] = Object.keys(grouped).map(month => ({
    month,
    dates: grouped[month].sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime()),
  }));

  return result.sort((a, b) => {
    const dateA = new Date(`${a.dates[0].value}T00:00:00Z`);
    const dateB = new Date(`${b.dates[0].value}T00:00:00Z`);
    return dateB.getTime() - dateA.getTime();
  });
}

export {
  groupDatesByMonth,
}
