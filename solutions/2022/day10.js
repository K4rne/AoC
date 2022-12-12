"use strict";
module.exports = (input)=>{
	const lines = input.split("\n").filter(line=>line!=="").map(line=>line.split(" ").map(e=>isNaN(+e)?e:+e));
	let X = 1;
	let cycle = 0;
	let signalSum = 0;
	const screen = [...Array(6)].map(_=>Array(40).fill("?"));
	
	function onCycleStart(){
		const pixelY = cycle/40 | 0;
		const pixelX = cycle%40;
		screen[pixelY][pixelX] = (pixelX >= X-1) && (pixelX <= X+1) ? "█" : " ";
	
		if((++cycle + 20) % 40 === 0){
			signalSum += cycle*X;
		}
	}
	
	for(const [instruction, value] of lines){
		onCycleStart();
		if(instruction === "addx"){
			onCycleStart();
			X += value;
		}
	}
	return {
		part1: signalSum,
		part2: "\n"+screen.map(line=>line.join("")).join("\n")
	};
};