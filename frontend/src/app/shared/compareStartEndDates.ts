export const compareStartEndDates = (startDate: Date, endDate: Date): boolean => {
  return startDate >= endDate ? false : true;
}

export const validateStartDate = (date: Date): boolean => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  return new Date(date) >= startDate;
}

export const validateEndDate = (date: Date): boolean => {
  return new Date(date) >= new Date();
}
