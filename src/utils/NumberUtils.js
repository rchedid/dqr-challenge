const countNumberDigits = number => {
  const numberIntegerPart = Math.abs(Math.trunc(number));

  return {
    integerPart: numberIntegerPart.toString().length,
    decimalPart: Math.abs(number).toString().replace('.', '').length - numberIntegerPart.toString().length,
  };
};

module.exports = { countNumberDigits };
