"use strict";
const sum = (a, b)=>a+b;
function extrapolate(values, backward=false){
	const diff = [...Array(values.length-1)].map((_, i)=>values[i+1]-values[i]);
	const diffNextValue = diff.some(n=>n!==0) ? extrapolate(diff, backward) : 0;
	return values.at(backward ? 0 : -1) + diffNextValue * (backward ? -1 : 1);
}

module.exports = (input)=>{
	const logs = input.split("\r\n").filter(e=>e!=="").map(line=>line.split(" ").map(n=>+n));
	return {
		part1: logs.map(history=>extrapolate(history, false)).reduce(sum),
		part2: logs.map(history=>extrapolate(history, true)).reduce(sum)
	};
};