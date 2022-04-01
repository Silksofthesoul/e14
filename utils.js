const {parse, stringify} = JSON;
const { min, max, atan, atan2, abc, PI } = Math;
const p = str => parse(str);
const s = obj => stringify(obj);
const co = obj => p(s(obj));
const floor = _ => Math.floor(_);
const int = val => parseInt(val);

const random = _ => Math.random();
const rndMinMaxInt = (min, max) => floor(random() * (max - min + 1)) + min;
const rndCoinBool = _ => (~~floor(random() * 2) === 0);
const rndFromArray = arr => arr[rndMinMaxInt(0, arr.length - 1)];

const removeProperty = prop => ({ [prop]: undefined, ...object }) => object;

const getRndId = (start = 3, end = 9, _library = null) => {
  const library = _library || 'qwertyuiopasdfghjklzxcvbnm_';
  const prefix = `${rndFromArray(library)}${rndFromArray(library)}`;
  const c = range(start, end)
    .map((item, i) => (i % start === 0 ? rndMinMaxInt(0, 9) : rndFromArray(library)))
    .join('');
  return prefix + start + c;
};

const range = (...args) => {
  // data example
  //    like python function
  // with 1 argument: 10
  //    from 0 to 10
  // with 2 argument: 1995 2005
  //    from 1995 to 2005
  // with 3 argument: 1 10 3
  //    from 1 to 10 with step 3
  let start = 0;
  let end = 0;
  let step = 0;
  if (args.length === 0) {
    return [];
  } if (args.length === 1) {
    start = 0;
    end = args[0];
    step = 1;
  } else if (args.length === 2) {
    start = args[0];
    end = args[1];
    step = 1;
  } else if (args.length === 3) {
    start = args[0];
    end = args[1];
    step = args[2];
  } else {
    start = args[0];
    end = args[1];
    step = args[2];
  }
  const result = [];
  let isRun = true;
  let current = start;
  while (isRun) {
    result.push(current);
    current += step;
    if (current > end) {
      isRun = false;
      break;
    }
  }
  return result;
};

const middle = (...arr) => arr.reduce((s,c,i) => (s+=c, s), 0) / arr.length;
const check = (x, [start, end]) => x >= start && x <= end;
const inRange = (x, [start, end], isEdge = true) => isEdge ? x >= start && x <= end: x > start && x < end;

const getLast = arr => arr[arr.length - 1];
