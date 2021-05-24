export const calculate = rssi => {
  const distance = Math.pow(10, (-69 - rssi) / (10 * 2));
  return distance.toFixed(3);
};
