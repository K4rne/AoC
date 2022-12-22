"use strict";
const [RIGHT, DOWN, LEFT, UP] = [0, 1, 2, 3];
const zoneSize = 50;//hardcoded :c
const inputZones = [
	{id: 1, start: {x: 50, y: 0}, end: {x: 99, y: 49}},
	{id: 2, start: {x: 100, y: 0}, end: {x: 149, y: 49}},
	{id: 3, start: {x: 50, y: 50}, end: {x: 99, y: 99}},
	{id: 4, start: {x: 0, y: 100}, end: {x: 49, y: 149}},
	{id: 5, start: {x: 0, y: 150}, end: {x: 49, y: 199}},
	{id: 6, start: {x: 50, y: 100}, end: {x: 99, y: 149}}
]//hardcoded :c
const inputCube = {
	1: {
		0: {face: 2, dir: RIGHT, axis: "y+"},
		1: {face: 3, dir: DOWN, axis: "x+"},
		2: {face: 4, dir: RIGHT, axis: "y-"},
		3: {face: 5, dir: RIGHT, axis: "x+"}
	},
	2: {
		0: {face: 6, dir: LEFT, axis: "y-"},
		1: {face: 3, dir: LEFT, axis: "x+"},
		2: {face: 1, dir: LEFT, axis: "y+"},
		3: {face: 5, dir: UP, axis: "x+"}
	},
	3: {
		0: {face: 2, dir: UP, axis: "y+"},
		1: {face: 6, dir: DOWN, axis: "x+"},
		2: {face: 4, dir: DOWN, axis: "y+"},
		3: {face: 1, dir: UP, axis: "x+"}
	},
	4: {
		0: {face: 6, dir: RIGHT, axis: "y+"},
		1: {face: 5, dir: DOWN, axis: "x+"},
		2: {face: 1, dir: RIGHT, axis: "y-"},
		3: {face: 3, dir: RIGHT, axis: "x+"}
	},
	5: {
		0: {face: 6, dir: UP, axis: "y+"},
		1: {face: 2, dir: DOWN, axis: "x+"},
		2: {face: 1, dir: DOWN, axis: "y+"},
		3: {face: 4, dir: UP, axis: "x+"}
	},
	6: {
		0: {face: 2, dir: LEFT, axis: "y-"},
		1: {face: 5, dir: LEFT, axis: "x+"},
		2: {face: 4, dir: LEFT, axis: "y+"},
		3: {face: 3, dir: UP, axis: "x+"}
	}
}//hardcoded :c

class Cell{
	static instances = {};
	constructor(x, y, wall){
		this.x = x;
		this.y = y;
		this.wall = wall;
		this.neighbors = {};
		this.cubeNeighbors = {};
		Cell.instances[hash(x, y)] = this;
	}
	wrapAroundGrid(offX, offY){
		let i = 0;
		let lastCell = this;
		while(true){
			i++;
			const cell = Cell.instances[hash(this.x - offX*i, this.y - offY*i)];
			if(cell instanceof Cell){
				lastCell = cell;
			}else{
				return lastCell;
			}
		}
	}
	updateNeighbors(){
		this.updateGridNeighbors();
		this.updateCubeNeighbors();
	}
	updateGridNeighbors(){
		const cells = Cell.instances;
		const offsets = [[1, 0], [0, 1], [-1, 0], [0, -1]];
		for(const i in offsets){
			const [offX, offY] = offsets[i];
			const x = this.x + offX;
			const y = this.y + offY;
			const cell = cells[hash(x, y)] === undefined ? this.wrapAroundGrid(offX, offY) : cells[hash(x, y)];
			if(!cell.wall){
				this.neighbors[i] = {dir: +i, cell};
			}
		}
	}
	updateCubeNeighbors(){
		function isInside(x, y, start, end){
			return x >= start.x && y >= start.y && x <= end.x && y <= end.y;
		}
		const cells = Cell.instances;
		const offsets = [[1, 0], [0, 1], [-1, 0], [0, -1]];
		const zone = inputZones.find(({start, end})=>isInside(this.x, this.y, start, end));
		for(const i in offsets){
			const [offX, offY] = offsets[i];
			const x = this.x + offX;
			const y = this.y + offY;
			if(isInside(x, y, zone.start, zone.end)){
				const cell = cells[hash(x, y)];
				if(!cell.wall){
					this.cubeNeighbors[i] = {dir: +i, cell};
				}
			}else{
				const relX = this.x - zone.start.x;
				const relY = this.y - zone.start.y;
				const nextZone = inputCube[zone.id][i];
				const {start, end} = inputZones.find(desc=>desc.id === nextZone.face);
				const [axis, positive] = [...nextZone.axis];
				let axisValue = axis==="x" ? relX : relY;
				axisValue = positive==="+" ? axisValue : (zoneSize-1) - axisValue; 
				let cell;
				switch(nextZone.dir){
					case RIGHT:
						cell = cells[hash(start.x, start.y+axisValue)];
						break;
					case DOWN:
						cell = cells[hash(start.x+axisValue, start.y)];
						break;
					case LEFT:
						cell = cells[hash(end.x, start.y+axisValue)];
						break;
					case UP:
						cell = cells[hash(start.x+axisValue, end.y)];
						break;
				}
				if(!cell.wall){
					this.cubeNeighbors[i] = {dir: nextZone.dir, cell};
				}
			}
		}
	}
}

function hash(x, y){
	return `${x};${y}`;
}
function parseGrid(grid){
	const cells = [];
	const height = grid.length;
	for(let y = 0; y < height; y++){
		const line = grid[y];
		const width = line.length;
		for(let x = 0; x < width; x++){
			const char = line[x];
			if(char !== " "){
				cells.push(new Cell(x, y, char === "#"));
			}
		}
	}
	return cells;
}
function followPath(path, startCell, useCubeNeighbors){
	let cur = startCell;
	let dir = 0;
	for(const instruction of path){
		if(typeof instruction === "number"){
			for(let i = 0; i < instruction; i++){
				const next = useCubeNeighbors ? cur.cubeNeighbors[dir] : cur.neighbors[dir];
				if(next === undefined){break;}
				cur = next.cell;
				dir = next.dir;
			}
		}else{
			dir = (dir+(instruction === "L" ? 3 : 1))%4;
		}
	}
	return {row: cur.y+1, column: cur.x+1, facing: dir};
}
function getFinalPassword({row, column, facing}){
	return 1000 * row + 4 * column + facing;
}

module.exports = (input)=>{
	const [rawGrid, rawPath] = input.split("\n\n").map(part=>part.split("\n").filter(line=>line!==""));
	const path = rawPath[0].match(/\d+|[LR]/g).map(e=>isNaN(+e)?e:+e);
	const cells = parseGrid(rawGrid.map(line=>[...line]));
	cells.forEach(cell=>cell.updateNeighbors());
	return {
		part1: getFinalPassword(followPath(path, cells[0], false)),
		part2: getFinalPassword(followPath(path, cells[0], true))
	};
};