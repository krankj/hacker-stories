import React from "react";

let map = Array.prototype.map;
let a = map.call("sudarshan", (x) => x.charCodeAt(0));

console.log(a);

let pets = ["dog", "cat", "hosrse", "cat", "dog"];

let petCount = pets.reduce((obj, pet) => {
  if (!obj[pet]) {
    obj[pet] = 1;
  } else {
    obj[pet]++;
  }
  return obj;
}, {});

function foo(n) {
  var f = () => arguments[0] + n;
  return f();
}

function myFunction(v, w, x, y, z) {
  console.log(`${v},${w},${x},${y},${z}`);
}
const args = [0, 1];
myFunction(-1, ...args, 2, ...[6]);

console.log(petCount);
