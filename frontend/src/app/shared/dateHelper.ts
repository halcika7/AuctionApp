export const buildDate = (date: string): Date => {
  return new Date(date);
};

export const getYearMonthDay = (
  date: Date
): { month: string; day: number; year: number } => {
  const month = new Intl.DateTimeFormat("en", {
    month: "short"
  }).format(date);
  return {
    month,
    day: date.getDate(),
    year: date.getFullYear()
  };
};

export const getMonths = (): string[] => [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const getMonthNumber = (): string[] => [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12"
];

export const getYears = (
  addSubtractYears: number = 0,
  lastyears: number = 130
): number[] => {
  let years: number[] = [];
  const d = new Date();
  for (
    let i = d.getFullYear() + addSubtractYears;
    i > d.getFullYear() - lastyears;
    i--
  ) {
    years.push(i);
  }
  return years;
};

export const getNextFourYears = () => {
  let years: number[] = [];
  const d = new Date();
  for (let i = d.getFullYear(); i < d.getFullYear() + 4; i++) {
    years.push(i);
  }
  return years;
};

export const getMonthDays = (choosenMonth: string, year: number): number[] => {
  const days = [];
  const month = getMonths().findIndex(month => month === choosenMonth);
  let date = new Date(Date.UTC(year, month, 1));
  let i = 0;
  while (date.getMonth() === month) {
    i++;
    days.push(i);
    date.setDate(date.getDate() + 1);
  }
  return days;
};
