"use strict";
const height = 10000;

class Rock{
	static shapes = [
		[[1,1,1,1]],

		[[0,1,0],
		 [1,1,1],
		 [0,1,0]],
	
		[[0,0,1],
		 [0,0,1],
		 [1,1,1]],
	
		[[1],
		 [1],
		 [1],
		 [1]],
	
		[[1,1],
		 [1,1]]
	].map(shape=>shape.map(line=>line.map(Boolean)));

	static last = undefined;
	constructor(rockIndex, botLeft, grid){
		this.id = rockIndex;
		this.botLeft = botLeft;
		this.grid = grid;

		this.shapeId = rockIndex%Rock.shapes.length;
		this.shape = Rock.shapes[this.shapeId];
		this.size = {x: this.shape[0].length, y: this.shape.length}

		this.parent = Rock.last;
		Rock.last = this;
	}
	forEachCell(cb){
		const {shape, botLeft, size} = this;
		forEachLoop:
		for(let rY = 0; rY < size.y; rY++){
			for(let rX = 0; rX < size.x; rX++){
				if(!shape[rY][rX]){continue;}
				const x = botLeft.x + rX;
				const y = botLeft.y + (size.y - 1) - rY;
				const stop = cb(x, y);
				if(stop){break forEachLoop;}
			}
		}
	}
	move(offsetX, offsetY){
		let collision = false
		this.forEachCell((cellX, cellY)=>{
			const x = offsetX + cellX;
			const y = offsetY + cellY;
			if(!(x >= 0 && x < 7 && y >= 0 && y < height && this.grid[y][x] === undefined)){
				collision = true;
			}
			return collision;
		});
		if(!collision){
			this.botLeft.x += offsetX;
			this.botLeft.y += offsetY;
		}
		return !collision;
	}
	drawRock(){this.forEachCell((x, y)=>{this.grid[y][x] = this;});}
	absoluteHeight(){return this.botLeft.y+this.size.y}
}

function searchPattern(grid, highestY){
	const minPatternSize = 50;
	if(highestY < minPatternSize*2){return [false,,,];}
	for(let offset = 0; offset < (highestY-minPatternSize*2); offset++){
		if((highestY-offset) % 2 === 1){continue;}
		const patternSize = (highestY-offset)/2;
		const rocks = new Set();
		let identical = true;
		identicalLoop:
		for(let y = 0; y < patternSize; y++){
			const Ay = offset+y;
			const By = offset+y+patternSize;
			for(let x = 0; x < 7; x++){
				const A = grid[Ay][x];
				const B = grid[By][x];
				if(A === undefined || B === undefined){
					if(!(A === undefined && B === undefined)){
						identical = false;
						break identicalLoop;
					}
				}else{
					if(A.shapeId !== B.shapeId){
						identical = false;
						break identicalLoop;
					}
					rocks.add(A);
				}
				
			}
		}
		if(identical){
			return [true, offset, patternSize, rocks];
		}
	}
	return [false,,,];
}
function simulate(moves, maxRocks){//has "off by 1" bug
	const grid = [...Array(height)].map(_=>Array(7));
	let highestY = 0;
	let moveIndex = 0;
	for(let rockIndex = 0; rockIndex < maxRocks; rockIndex++){
		const rock = new Rock(rockIndex, {x: 2, y: 3+highestY}, grid);
		let landed = false;
		while(!landed){
			const right = moves[moveIndex++%moves.length];
			rock.move(right?1:-1, 0);
			if(!rock.move(0, -1)){
				rock.drawRock();
				highestY = Math.max(highestY, rock.absoluteHeight());
				landed = true;
			}
		}
		const [patternFound, offset, size, rocks] = searchPattern(grid, highestY);
		if(patternFound){
			const repetition = Math.trunc((maxRocks - rockIndex) / rocks.size);
			const postRepetitionRocks = (maxRocks - rockIndex) % rocks.size;

			let postHeight = 0;
			const rocksIterator = rocks.values();
			for(let i = 0; i < postRepetitionRocks; i++){
				postHeight = Math.max(postHeight, rocksIterator.next().value.absoluteHeight()-offset);
			}
			return highestY + (repetition * size)-1 + postHeight;
		}
	}
	return highestY;
}

module.exports = (input)=>{
	const moves = [...input.replace("\n", "")].map(char=>char===">");
	return {
		part1: simulate(moves, 2022),
		part2: simulate(moves, 1000000000000)
	};
};