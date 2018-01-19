function simpleInfo(f) {
  return function(x) {
    if (f(x))
      return null;
    return `${x.toString()} is not ${f.name}`;
  };
}
function condInfo(f, cond, val) {
  return function(x) {
    if (f(x))
      return null;
    return `${x.toString()} is not ${cond} than ${val}`;
  };
}

export function nully(x) {
  return x == null;
}
nully.info = simpleInfo(nully);

export function bool(x) {
  return typeof x === "boolean";
}
bool.info = simpleInfo(nully);

export function string(x) {
  return typeof x === "string";
}
string.info = simpleInfo(string);

export function number(x) {
  return Number.isFinite(x);
}
number.info = simpleInfo(string);

export function positive(x) {
  return number(x) && x > 0;
}
positive.info = simpleInfo(positive);

export function integer(x) {
  return Number.isSafeInteger(x);
}
integer.info = simpleInfo(integer);

export function lower(val) {
  check(number, val);
  const r = function(x) {
    return number(x) && x < val;
  };
  r.info = condInfo(r, "lower", val);
  return r;
}

export function greater(val) {
  check(number, val);
  const r = function(x) {
    return number(x) && x > val;
  };
  r.info = condInfo(r, "greater", val);
  return r;
}

export function leq(val) {
  check(number, val);
  const r = function(x) {
    return number(x) && x <= val;
  };
  r.info = condInfo(r, "lower or equal", val);
  return r;
}

export function geq(val) {
  check(number, val);
  const r = function(x) {
    return number(x) && x >= val;
  };
  r.info = condInfo(r, "greater or equal", val);
  return r;
}

export function all() {
  const args = arguments;
  const r = function(value) {
    for (const arg of args)
      if (!arg(value))
        return false;
    return true;
  };
  r.info = function(value) {
    for (const arg of args)
      if (!arg(value))
        return arg.info(value);
    return null;
  };
  return r;
}

export function any() {
  const args = arguments;
  const r = function(value) {
    for (const arg of args)
      if (arg(value))
        return true;
    return false;
  };
  r.info = function(value) {
    if (args.length === 0)
      return "no arguments - any() always fails";
    const errs = [];
    for (const arg of args)
      if (arg(value))
        return null;
      else
        errs.push(arg.info(value));
    return errs.join(" and ");
  };
  return r;
}

export function isany() {
  const argsarr = Array.prototype.slice.call(arguments);
  return any(...argsarr.map(is));
}

export function is(val) {
  const r = function(other) {
    return val === other;
  };
  r.info = function (x) {
    if (r(x))
      return null;
    return `${x.toString()} is not ${val.toString()}`;
  };
  return r;
}

export function maybe(test) {
  return any(nully, test);
}

export function obj(object) {
  const r = function(x) {
    if (typeof x !== "object")
      return false;
    for (const [key, test] of Object.entries(object))
      if (!test(x[key]))
        return false;
    return true;
  };
  r.info = function(x) {
    if (typeof x !== "object")
      return `${x.toString()} is not an object`;
    for (const [key, test] of Object.entries(object))
      if (!test(x[key]))
        return `{${key}: ${test.info(x[key])}}`;
    return null;
  };
  return r;
}

export function values(test) {
  const r = function(x) {
    if (typeof x !== "object")
      return false;
    for (const val of Object.values(x))
      if (!test(val))
        return false;
    return true;
  };
  r.info = function(x) {
    if (typeof x !== "object")
      return `${x.toString()} is not an object`;
    for (const [key, val] of Object.entries(x))
      if (!test(val))
        return `{${key}: ${test.info(val)}}`;
    return true;
  };
  return r;
}

export function check(test, value) {
  if (!test(value))
    throw Error(test.info(value));
}
export function postcheck(test, f) {
  return function() {
    const result = f(...arguments);
    check(test, result);
    return result;
  }
}