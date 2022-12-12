"use strict";
class Cell{
	constructor(x, y, height){
		this.x = x;
		this.y = y;
		this.height = "abcdefghijklmnopqrstuvwxyz".indexOf(height);

		this.start = (height === "S")
		this.goal = (height === "E");
		if(this.height === -1){
			this.height = this.goal ? 25 : 0;
		}

		this.grid = undefined;
		this.neighbors = undefined;
		this.distance = -1;
		this.goalDistance = -1;
	}
	updateGrid(grid){
		this.grid = grid;
		this.neighbors = [
			grid[this.y][this.x+1],
			grid[this.y][this.x-1],
			grid[this.y+1]?.[this.x],
			grid[this.y-1]?.[this.x]
		].filter(cell=>(cell instanceof Cell) && (cell.height <= this.height+1));
	}
}

function BFS(start){
	start.distance = 0;

	const queue = [start];
	const explored = new Set([start]);
	while(queue.length > 0){
		const cell = queue.shift();
		for(const neighbor of cell.neighbors){
			if(!explored.has(neighbor)){
				explored.add(neighbor);
				queue.push(neighbor);
				neighbor.distance = cell.distance + 1;
			}
		}
	}
}

module.exports = (input)=>{
	const grid = input.split("\n").filter(e=>e!=="").map((line, y)=>[...line].map((height, x)=>new Cell(x, y, height)));
	
	const flatGrid = grid.flat(1);
	flatGrid.forEach(cell=>cell.updateGrid(grid));
	
	const start = flatGrid.find(cell=>cell.start);
	const goal = flatGrid.find(cell=>cell.goal);
	
	const possibleStartCell = flatGrid.filter(cell=>{
		if(cell.height === 0){
			goal.distance = -1;
			BFS(cell);
			cell.goalDistance = goal.distance;
			return cell.goalDistance !== -1;
		}
		return false;
	});
	possibleStartCell.sort((a, b)=>(a.goalDistance-b.goalDistance));
	return {
		part1: start.goalDistance,
		part2: possibleStartCell[0].goalDistance
	};
};