export const formatNumber = (num: number, precision: number, addZero = true): string => {
  let formattedNum = num.toFixed(precision);
  const numWithoutZero = formattedNum.replace(/\.?0+$/, "");

  return formatNumberWithPrecision(Number(numWithoutZero), addZero);
};

const formatNumberWithPrecision = (num: number, addZero?: boolean): string => {
  const numString = num.toString();
  const decimalIndex = numString.indexOf(".");
  if (decimalIndex === -1) {
    return numString + (addZero ? ".00" : "");
  } else if (numString.length - decimalIndex === 2) {
    return num.toFixed(1) + (addZero ? "0" : "");
  } else {
    return numString;
  }
};

