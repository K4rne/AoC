"use strict";
const gridSize = 750;

module.exports = (input)=>{
	const motions = input.split("\n").filter(e=>e!=="").map(e=>e.split(" ")).map(line=>({dir: line[0], steps: +line[1]}));
	const head = {x: gridSize/2, y: gridSize/2};
	const tails = [...Array(9)].map(_=>({x: gridSize/2, y: gridSize/2}));
	const tailGrid = [...Array(gridSize)].map(line=>Array(gridSize).fill(0));
	
	for(const {dir, steps} of motions){
		for(let i = 0; i < steps; i++){
			switch(dir){
				case "R": head.x++; break;
				case "L": head.x--; break;
				case "D": head.y++; break;
				case "U": head.y--; break;
			}
			for(let i = 0; i < tails.length; i++){
				const curHead = (i-1 < 0) ? head : tails[i-1];
				const tail = tails[i];
	
				const diff = {x: curHead.x-tail.x + 2, y: curHead.y-tail.y + 2};
				const x = [
					[1, 1, 2, 3, 3],
					[1, 2, 2, 2, 3],
					[1, 2, 2, 2, 3],
					[1, 2, 2, 2, 3],
					[1, 1, 2, 3, 3]
				];
				const y = [
					[1, 1, 1, 1, 1],
					[1, 2, 2, 2, 1],
					[2, 2, 2, 2, 2],
					[3, 2, 2, 2, 3],
					[3, 3, 3, 3, 3]
				];
				tail.x += x[diff.y][diff.x] - 2;
				tail.y += y[diff.y][diff.x] - 2;
				tailGrid[tail.y][tail.x] |= (0x1 << i);
			}
		}
	}

	return {
		part1: tailGrid.map(line=>line.filter(cell=>(cell >>> 0) & 0x1).length).reduce((a, b)=>a+b),
		part2: tailGrid.map(line=>line.filter(cell=>(cell >>> 8) & 0x1).length).reduce((a, b)=>a+b)
	};
};