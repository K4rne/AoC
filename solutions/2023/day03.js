"use strict";
const sum = (a, b)=>a+b;
const directions = [
	{x: -1, y: -1}, {x: +0, y: -1}, {x: +1, y: -1},
	{x: -1, y: +0},                 {x: +1, y: +0},
	{x: -1, y: +1}, {x: +0, y: +1}, {x: +1, y: +1},
]
function searchForAdjacentNumbers(grid, startX, startY){
	function readWholeNumber(startX, startY){
		const line = grid[startY];
		let [x, number, numberDigit] = [startX, 0, 0];
		while(!isNaN(line[x+1])){x++;}
		while(!isNaN(line[x])){
			numbersKnown[`${startY}|${x}`] = true;
			number += (10**numberDigit++) * (+line[x--]);
		}
		return number;
	}
	const [numbers, numbersKnown] = [[], {}];
	for(const dir of directions){
		const y = startY + dir.y;
		const x = startX + dir.x;
		if(!isNaN(grid[y]?.[x])){
			if(!numbersKnown[`${y}|${x}`]){
				numbers.push(readWholeNumber(x, y));
			}
		}
	}
	return numbers;
}

module.exports = (input)=>{
	const grid = input.split("\r\n").filter(e=>e!=="").map(line=>[...line]);
	const [partNumbers, gearRatios] = [[], []];
	grid.forEach((line, y)=>line.forEach((char, x)=>{
		if(char !== "." && isNaN(char)){
			const numbers = searchForAdjacentNumbers(grid, x, y);
			partNumbers.push(...numbers);
			if(char === "*" && numbers.length === 2){
				gearRatios.push(numbers[0]*numbers[1]);
			}
		}
	}));
	return {
		part1: partNumbers.reduce(sum),
		part2: gearRatios.reduce(sum)
	};
};