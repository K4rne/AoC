"use strict";
module.exports = (input)=>{
	const elves = input.split("\n\n").filter(e=>e!=="").map(e=>e.split("\n").map(e=>parseInt(e)));
	const elvesTotal = elves.map(e=>e.reduce((a, b)=>a+b));
	elvesTotal.sort((a, b)=>b-a);
	return {
		part1: elvesTotal[0],
		part2: elvesTotal[0] + elvesTotal[1] + elvesTotal[2]
	};
};