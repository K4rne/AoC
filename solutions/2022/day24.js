"use strict";
const mod = (a, b)=>((a % b) + b) % b;
class State{
	static states = new Set();
	constructor(grid, x=1, y=0, time=0, prev){
		State.states.add(`${x};${y};${time}`);
		this.grid = grid;
		this.x = x;
		this.y = y;
		this.time = time;
		this.prev = prev;

		if(grid.next === undefined){
			throw new Error(`undefined grid.next at time ${time}`);
		}
	}
	next(){
		const height = this.grid.length;
		const width = this.grid[0].length;
		const nextGrid = this.grid.next;
		if(this.y === 0){
			return [
				(this.time < 6) ? this.walk(1, 0) : undefined,
				(nextGrid[1][1] === ".") ? this.walk(1, 1) : undefined
			].filter(e=>e!==undefined);
		}
		if(this.y === height-1){
			return [
				(this.time < 6) ? this.walk(width-2, height-1) : undefined,
				(nextGrid[1][1] === ".") ? this.walk(width-2, height-2) : undefined
			].filter(e=>e!==undefined);
		}
		const states = [];
		const offsets = [[1, 0], [0, 1], [-1, 0], [0, -1], [0, 0]];
		for(const [xOff, yOff] of offsets){
			const [x, y] = [this.x+xOff, this.y+yOff];
			if(nextGrid[y][x] === "."){
				if(State.states.has(`${x};${y};${this.time+1}`)){continue;}
				states.push(this.walk(x, y));
			}
		}
		return states;
	}
	walk(x, y){
		return new State(this.grid.next, x, y, this.time+1, this);
	}
}

function generateGrids(lines, maxTime=2000){
	const height = lines.length;
	const width = lines[0].length;

	const blizzards = [];
	for(let y = 0; y < height; y++){
		for(let x = 0; x < width; x++){
			const char = lines[y][x];
			if(char !== "." || char !== "#"){
				switch(char){
					case "<": blizzards.push({x, y, char, xOff: -1, yOff: +0}); break;
					case ">": blizzards.push({x, y, char, xOff: +1, yOff: +0}); break;
					case "^": blizzards.push({x, y, char, xOff: +0, yOff: -1}); break;
					case "v": blizzards.push({x, y, char, xOff: +0, yOff: +1}); break;
				}
				
			}
		}
	}
	
	let prev = lines;
	for(let i = 1; i <= maxTime; i++){
		const cur = [...Array(height)].map((_, y)=>
			["#", ...((y===0||y===height-1)?"#":".").repeat(width-2), "#"]
		);
		for(const blizzard of blizzards){
			blizzard.x = mod((blizzard.x + blizzard.xOff - 1), (width-2)) + 1;
			blizzard.y = mod((blizzard.y + blizzard.yOff - 1), (height-2)) + 1;
			const {x, y, char, xOff, yOff} = blizzard;
			if(cur[y][x] === "."){
				cur[y][x] = char;
			}else{
				cur[y][x] = `${isNaN(+cur[y][x]) ? 2 : +cur[y][x]+1}`;
			}
		}
		cur[0][1] = ".";
		cur[height-1][width-2] = ".";

		prev.next = cur;
		prev = cur;
	}
	return lines;
}
function BFS(start, goal){
	const queue = [start];
	while(queue.length){
		const cur = queue.shift();
		if(cur.x === goal.x && cur.y === goal.y){
			return cur;
		}
		queue.push(...cur.next());
	}
}

module.exports = (input)=>{
	const startGrid = generateGrids(input.split("\n").filter(e=>e!=="").map(line=>[...line]));
	const height = startGrid.length;
	const width = startGrid[0].length;
	const step1 = BFS(new State(startGrid), {x: width-2, y: height-1});
	const step2 = BFS(step1, {x: 1, y: 0});
	const step3 = BFS(step2, {x: width-2, y: height-1});
	return {
		part1: step1.time,
		part2: step3.time
	};
};