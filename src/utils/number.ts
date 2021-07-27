export function interpolate(num: number, min: number, max: number, value1: number, value2: number) {
  if (num <= min) return value1;
  if (num >= max) return value2;

  const progress = (num - min) / (max - min);
  
  return value1 + progress * (value2 - value1);
}