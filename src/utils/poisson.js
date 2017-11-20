export function poissrand(lambda) {
  return poissinv(lambda, Math.random());
}

export function poissinv(lambda, random) {
  const c = Math.exp(-lambda);

  let cumulative = 0;
  let current = 0;
  let factorial = 1;
  let lambdapow = 1;
  while(true) {
    cumulative += c * lambdapow / factorial;
    if (cumulative >= random)
      return current;
    current += 1;
    factorial *= current;
    lambdapow *= lambda;
  }
}