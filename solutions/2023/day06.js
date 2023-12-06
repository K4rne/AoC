"use strict";
module.exports = (input)=>{
	const countWaysToWin = (t, d)=>1 + Math.floor((t+Math.sqrt(t*t - 4*d))/2) - Math.ceil((t-Math.sqrt(t*t - 4*d))/2);
	const lines = input.split("\r\n").filter(e=>e!=="").map(line=>line.replace(/ +/g, " ").split(" ")).map(([, ...line])=>line);
	const [part1Times, part1Distances] = lines.map(line=>line.map(n=>+n));
	const [part2Time, part2Distance] = lines.map(line=>+line.join(""));
	return {
		part1: part1Times.map((raceTime, i)=>countWaysToWin(raceTime, part1Distances[i])).reduce((a, b)=>a*b),
		part2: countWaysToWin(part2Time, part2Distance)
	};
};