

function isValidYearFormat(year: string) {
  const yearString = year.toString();
  return /^\d{4}$/.test(yearString) && Number(yearString) >= 1000 && Number(yearString) <= 9999; //true/false
}

export default isValidYearFormat;