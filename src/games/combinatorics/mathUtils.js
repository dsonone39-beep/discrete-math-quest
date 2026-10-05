// Counting helpers used to compute every combinatorics answer (no hard-coded results). Member 3.
export const fact = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
export const nPr = (n, r) => fact(n) / fact(n - r);
export const nCr = (n, r) => Math.round(fact(n) / (fact(r) * fact(n - r)));
export const multiset = (n, ...counts) => Math.round(fact(n) / counts.reduce((p, c) => p * fact(c), 1));
export const starsAndBars = (items, bins) => nCr(items + bins - 1, bins - 1);
export const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// |A1 ∪ ... ∪ An| for "divisible by" sets on 1..limit (inclusion-exclusion)
export function unionDivisible(limit, divisors) {
  let total = 0;
  for (let mask = 1; mask < 1 << divisors.length; mask++) {
    let lcm = 1, bits = 0;
    divisors.forEach((d, i) => { if (mask & (1 << i)) { bits++; lcm = (lcm * d) / gcd(lcm, d); } });
    total += (bits % 2 ? 1 : -1) * Math.floor(limit / lcm);
  }
  return total;
}
