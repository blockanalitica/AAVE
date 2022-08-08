export const shorten = (address) => {
  return address.slice(0, 5) + "..." + address.slice(-5);
};
