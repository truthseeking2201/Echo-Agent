import seedrandom from "seedrandom";

export const rng = seedrandom(process.env.DEMO_SEED ?? "42");

export const rand = () => rng.quick();  // 0-1

export const randRange = (min: number, max: number) => 
  min + rand() * (max - min);

export const triangularDist = (min: number, peak: number, max: number) => {
  const u = rand();
  const f = (peak - min) / (max - min);
  
  if (u < f) {
    return min + Math.sqrt(u * (max - min) * (peak - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - peak));
  }
};

export const normalDist = (mean: number, stdDev: number) => {
  // Box-Muller transform
  const u1 = rand();
  const u2 = rand();
  
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  
  return z0 * stdDev + mean;
};

export const clamp = (value: number, min: number, max: number) => 
  Math.max(min, Math.min(max, value));