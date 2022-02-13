const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

const dateFormatIsValid = date => {
  return dayjs(date, 'DD-MM-YYYY', true).isValid();
};

const countDateDifferenceFromToday = date => {
  return dayjs(dayjs().format('DD-MM-YYYY'), 'DD-MM-YYYY').diff(dayjs(date, 'DD-MM-YYYY'), 'day');
};

module.exports = {
  dateFormatIsValid,
  countDateDifferenceFromToday,
};
