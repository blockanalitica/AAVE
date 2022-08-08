import numeral from "numeral";

export const round = (value, decimals = 2) => {
  // https://www.jacklmoore.com/notes/rounding-in-javascript/
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

export const compact = (value, decimals = 2, hideZeroDecimals = false) => {
  let fmt = "0";
  if (decimals > 0) {
    let decimal_str = "0".repeat(decimals);
    if (hideZeroDecimals === true) {
      decimal_str = "[" + decimal_str + "]";
    }
    fmt = fmt + "." + decimal_str;
  }

  return numeral(value)
    .format(fmt + "a")
    .toUpperCase();
};

export const formatToDecimals = (value, decimals) => {
  let fmt = "0";
  if (decimals > 0) {
    if (value !== 0) {
      let decimal_str = "0".repeat(decimals);
      decimal_str = "[" + decimal_str + "]";

      fmt = fmt + "." + decimal_str;
    }
  }
  return numeral(round(value, decimals)).format("0," + fmt);
};
