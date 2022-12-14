"use strict";
function drawRocks(rockScan){
	function getAxisMinMax(rockScan, axis){
		let min = Infinity;
		let max = -Infinity;
		for(const line of rockScan){
			for(const coord of line){
				if(coord[axis] < min){min = coord[axis];}
				if(coord[axis] > max){max = coord[axis];}
			}
		}
		return [min, max];
	}
	function drawLine(grid, sX, sY, eX, eY){
		const xDraw = sX !== eX;
		const posDraw = xDraw ? (sX < eX) : (sY < eY);
		const start = posDraw ? (xDraw ? sX : sY) : (xDraw ? eX : eY);
		const end = posDraw ? (xDraw ? eX : eY) : (xDraw ? sX : sY);
		for(let i = start; i <= end; i++){
			grid[xDraw?sY:i][xDraw?i:sX] = "#";
		}
	}
	const [minX, maxX] = getAxisMinMax(rockScan, 0);
	const [minY, maxY] = getAxisMinMax(rockScan, 1);
	const height = 1+maxY;
	const width = 3+maxX-minX;
	const grid = [...Array(height)].map(_=>Array(width).fill("."));
	for(const line of rockScan){
		for(let i = 0; i < line.length-1; i++){
			const [sX, sY] = line[i];
			const [eX, eY] = line[i+1];
			drawLine(grid, 1+sX-minX, sY, 1+eX-minX, eY);
		}
	}
	grid[0][1+500-minX] = "+"
	return grid;
}

function sandFill(emptyGrid){
	function createSand(grid, x){
		const pos = {y: 0, x};
		const voidY = grid.length-1;
		while(pos.y < voidY){
			if(grid[pos.y+1][pos.x] === "."){
				pos.y += 1;
			}else if(grid[pos.y+1][pos.x-1] === "."){
				pos.y += 1;
				pos.x -= 1;
			}else if(grid[pos.y+1][pos.x+1] === "."){
				pos.y += 1;
				pos.x += 1;
			}else{
				if(grid[pos.y][pos.x] === "o"){return false;}
				grid[pos.y][pos.x] = "o";
				return true;
			}
		}
		return false;
	}
	const grid = emptyGrid.map(line=>line.slice(0));
	const startX = emptyGrid[0].findIndex(e=>e==="+");
	let i = 0;
	while(createSand(grid, startX)){i++;}
	return [grid, i];
}

function addFloor(emptyGrid){
	const height = emptyGrid.length + 2;
	const width = (emptyGrid[0].length) + height*2;
	return [
		...emptyGrid.map(line=>[
			...Array(height).fill("."),
			...line,
			...Array(height).fill(".")
		]),
		Array(width).fill("."),
		Array(width).fill("#")
	];
}

module.exports = (input)=>{
	const rockScan = input.split("\n").filter(e=>e!=="").map(line=>line.split(" -> ").map(coord=>coord.split(",").map(Number)));

	const voidGrid = drawRocks(rockScan);
	const floorGrid = addFloor(voidGrid);

	const [voidSandGrid, voidSandCount] = sandFill(voidGrid);
	const [floorSandGrid, floorSandCount] = sandFill(floorGrid);
	
	return {
		part1: voidSandCount,
		part2: floorSandCount
	};
};