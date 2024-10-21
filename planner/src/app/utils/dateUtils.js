//currently uses current date. furture dev, user may change useable date range (will need to re think first day)

const date = new Date();
//const date = new Date(`2024-10-18`);
const firstDay = new Date(`${date.getFullYear()}-${date.getMonth()+1}-01`);
const daysInMonthCalc = (year, month) => new Date(year, month, 0).getDate();
const daysInMonth = daysInMonthCalc(date.getFullYear(), date.getMonth()+1)
const dayOfWeek = date.getDay();
const firstDayOfMonth = firstDay.getDay()+1 >= 6 ? 0 : firstDay.getDay()+1;
//let currentDay = ();

export {daysInMonth, dayOfWeek, date, firstDayOfMonth};