export const compareStartEndDates = (startDate: Date, endDate: Date): boolean => {
  return startDate >= endDate ? false : true;
}

export const validateStartDate = (date: Date): boolean => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate());
  return new Date(date) >= startDate;
}

export const validateEndDate = (date: Date): boolean => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);
  return new Date(date) >= endDate;
}
