"use strict";
const hash = (x, y)=>`${x};${y}`;

class Elf{
	static count = 0;
	static positions = {};
	static isFree(x, y){
		return Elf.positions[hash(x, y)] === undefined;
	}
	constructor(x, y){
		this.x = x;
		this.y = y;

		Elf.count++;
		Elf.positions[hash(x, y)] = this;
	}
	chooseMove(moveOffset){
		const {x, y} = this;
		const moveChecks = [
			[[x, y-1], [x-1, y-1], [x+1, y-1]],
			[[x, y+1], [x-1, y+1], [x+1, y+1]],
			[[x-1, y], [x-1, y-1], [x-1, y+1]],
			[[x+1, y], [x+1, y-1], [x+1, y+1]]
		];
		if(this.getNeighbors().length === 0){return [x, y];}
		for(let i = 0; i < 4; i++){
			const [A, B, C] = moveChecks[(i+moveOffset)%4];
			if(Elf.isFree(...A) && Elf.isFree(...B) && Elf.isFree(...C)){
				return A;
			}
		}
		return [x, y];
	}
	applyMove(x, y){
		delete Elf.positions[hash(this.x, this.y)];
		this.x = x;
		this.y = y;
		Elf.positions[hash(x, y)] = this;
	}
	getNeighbors(){
		const {x, y} = this;
		return [
			Elf.positions[hash(x+1, y)],
			Elf.positions[hash(x-1, y)],
			Elf.positions[hash(x, y+1)],
			Elf.positions[hash(x, y-1)],
			Elf.positions[hash(x+1, y+1)],
			Elf.positions[hash(x+1, y-1)],
			Elf.positions[hash(x-1, y+1)],
			Elf.positions[hash(x-1, y-1)]
		].filter(elf=>elf instanceof Elf);
	}
}

function parseElves(grid){
	const elves = [];
	const height = grid.length;
	const width  = grid[0].length;
	for(let y = 0; y < height; y++){
		for(let x = 0; x < width; x++){
			const char = grid[y][x];
			if(char === "#"){
				elves.push(new Elf(x+5000, y+5000));
			}
		}
	}
	return elves;
}
function simulate(elves, snapshotRound){
	let emptyTiles;
	let someoneMoved = true;
	let i = 0;
	while(someoneMoved){
		someoneMoved = false;
		const moves = elves.map(elf=>elf.chooseMove(i%4));
		const nextPositions = {};
		moves.forEach(move=>{
			const h = hash(...move);
			nextPositions[h] = (nextPositions[h] ?? 0) + 1;
		});
		elves.forEach((elf, i)=>{
			if(nextPositions[hash(...moves[i])] >= 2){return;}
			if(moves[i][0] !== elf.x || moves[i][1] !== elf.y){
				elf.applyMove(...moves[i]);
				someoneMoved = true;
			}
		});
		if(++i === snapshotRound){
			emptyTiles = countEmptyTiles(elves);
		}
	}
	return [emptyTiles, i];
}
function countEmptyTiles(elves, printGrid=false){
	let rect = {
		min: {x: +Infinity, y: +Infinity},
		max: {x: -Infinity, y: -Infinity}
	};
	for(const elf of elves){
		if(elf.x > rect.max.x){rect.max.x = elf.x;}
		if(elf.x < rect.min.x){rect.min.x = elf.x;}
		if(elf.y > rect.max.y){rect.max.y = elf.y;}
		if(elf.y < rect.min.y){rect.min.y = elf.y;}
	}
	const width = 1+rect.max.x-rect.min.x;
	const height = 1+rect.max.y-rect.min.y;
	return width * height - Elf.count;
}

module.exports = (input)=>{
	const elves = parseElves(input.split("\n").filter(line=>line!==""));
	const [part1, part2] = simulate(elves, 10);
	return {part1, part2};
}