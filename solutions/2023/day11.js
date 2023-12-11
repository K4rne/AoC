"use strict";
const sum = (a, b)=>a+b;
function getGalaxies(grid, expandFactor=1){
	const galaxies = [];
	let yExpansion = 0;
	for(let y = 0; y < grid.length; y++){
		if(!grid[y].some(char=>char==="#")){
			yExpansion++;
		}else{
			let xExpansion = 0;
			for(let x = 0; x < grid[y].length; x++){
				if(grid[y][x] === "#"){
					galaxies.push({x: x+xExpansion*expandFactor, y: y+yExpansion*expandFactor});
				}else if(!grid.some(line=>line[x]==="#")){
					xExpansion++;
				}
			}
		}
	}
	return galaxies;
}
function getPairDistances(galaxies){
	const distances = [];
	for(let A = 0; A < galaxies.length-1; A++){
		for(let B = A+1; B < galaxies.length; B++){
			distances.push(Math.abs(galaxies[B].x - galaxies[A].x) + Math.abs(galaxies[B].y - galaxies[A].y));
		}
	}
	return distances;
}

module.exports = (input)=>{
	const grid = input.split("\r\n").filter(e=>e!=="").map(line=>[...line]);
	return {
		part1: getPairDistances(getGalaxies(grid, 1)).reduce(sum),
		part2: getPairDistances(getGalaxies(grid, 999999)).reduce(sum)
	};
};