exports.addSubtractDaysToDate = (days, add = true) => {
  let date = new Date();
  add && date.setDate(date.getDate() + days);
  !add && date.setDate(date.getDate() - days);
  return date;
};
