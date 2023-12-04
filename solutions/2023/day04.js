"use strict";
const sum = (a, b)=>a+b;

module.exports = (input)=>{
	const matchingNumbers = input.split("\r\n").filter(e=>e!=="").map(line=>{
		const [winningNumbers, numbers] = line.replace(/  /g, " ").split(": ")[1].split(" | ").map(e=>e.split(" ").map(n=>+n));
		return numbers.filter(number=>winningNumbers.includes(number)).length;
	});
	const cardInstances = [...Array(matchingNumbers.length)].fill(1);
	for(let i = 0; i < cardInstances.length; i++){
		for(let j = matchingNumbers[i]; j; j--){
			cardInstances[i+j] += cardInstances[i];
		}
	}
	return {
		part1: matchingNumbers.map(n=>2**(n-1)|0).reduce(sum),
		part2: cardInstances.reduce(sum)
	};
};