const obj1 = { a: 1, b: 2, c: 3 };
const c = "DuckSize";

const newobj = {
  ...obj1,
  [c]: 5,
};

console.log(newobj);

const a = "";
// console.log(a);
