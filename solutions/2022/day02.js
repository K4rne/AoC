"use strict";
const mod = (a, b)=>((a % b) + b) % b;
const sum = (a, b)=>a+b;
const RPStoInt = {A: 0, B: 1, C: 2, X: 0, Y: 1, Z: 2};
const scoreDict = [[3, 6, 0], [0, 3, 6], [6, 0, 3]];
const part1 = (A, B)=>(B+1 + scoreDict[A][B]);
const part2 = (A, B)=>(B*3 + mod(A+B-1, 3)+1);

module.exports = (input)=>{
	const rounds = input.split("\n").filter(e=>e!=="").map(e=>e.split(" ").map(e=>RPStoInt[e]));
	return {
		part1: rounds.map(e=>part1(...e)).reduce(sum),
		part2: rounds.map(e=>part2(...e)).reduce(sum)
	}
}