"use strict";
class Cube{
	static faces = [
		[+0,+0,+1],
		[+0,+1,+0],
		[+1,+0,+0],
		[+0,+0,-1],
		[+0,-1,+0],
		[-1,+0,+0],
	];
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.adjacentCubes = new Set();
	}
	searchAdjacentCubes(cubes){
		const {x, y, z, adjacentCubes} = this;
		for(const cube of cubes){
			if(cube === this){continue;}
			const dist = Math.abs(x - cube.x) + Math.abs(y - cube.y) + Math.abs(z - cube.z);
			if(dist === 1){
				adjacentCubes.add(cube);
			}
		}
	}
	getSurface(airPockets, grid){
		if(airPockets){
			return 6-this.adjacentCubes.size;
		}else{
			const {x, y, z} = this;
			return Cube.faces.map(([oX, oY, oZ])=>{
				const cubeHash = hash(x+oX, y+oY, z+oZ);
				if(grid[cubeHash] !== undefined){return;}

				const escaped = escape(x+oX, y+oY, z+oZ, grid);
				//if(!escaped){console.error(explored);}
				return escaped;
			}).filter(Boolean).length;
		}
	}
}

function escape(x, y, z, grid, size=1000, explored=new Set()){
	const cubeHash = hash(x, y, z);
	if(explored.has(cubeHash) || grid[cubeHash] !== undefined){
		return false;
	}else if(size === 0){
		return true;
	}else{
		explored.add(cubeHash);
		return Cube.faces.some(([oX, oY, oZ])=>escape(x+oX, y+oY, z+oZ, grid, size-1, explored));
	}
}
function hash(x, y, z){
	return `${x};${y};${z}`;
}
function getTotalSurface(cubes, grid, airPockets){
	return cubes.map(cube=>cube.getSurface(airPockets, grid)).reduce((a, b)=>a+b, 0);
}

module.exports = (input)=>{
	const cubesPos = input.split("\n").filter(e=>e!=="").map(line=>line.split(",").map(Number));
	const cubes = cubesPos.map(position=>new Cube(...position));
	const grid = {};
	cubes.forEach(cube=>{
		cube.searchAdjacentCubes(cubes);
		grid[hash(cube.x, cube.y, cube.z)] = cube;
	});
	return {
		part1: getTotalSurface(cubes, grid, true),
		part2: getTotalSurface(cubes, grid, false)
	};
};