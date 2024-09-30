
function getDaysInMonth(monthYear: string): number {
    const [monthStr, yearStr] = monthYear.split(' ');
    const year = parseInt(yearStr, 10);
    const monthMap: { [key: string]: number } = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
    const month = monthMap[monthStr];
    if (month === undefined) throw new Error('Invalid month name');

    return new Date(year, month + 1, 0).getDate();
}

export default getDaysInMonth;