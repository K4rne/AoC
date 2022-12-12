"use strict";
function parseCrates(string){
	const lines = string.split("\n");
	const indexes = lines.pop();

	const width = parseInt( indexes.replace(/\s+/g, "").split("").pop() );
	const grid = [...Array(width)].map(_=>[]);

	let x = 0;
	for(const charI in indexes){
		if(+indexes[charI] === 1+x){
			for(let y = lines.length-1; y >= 0; y--){
				const crate = lines[y][charI];
				if(crate !== " "){
					grid[x].push(crate);
				}
			}
			x++;
		}
	}
	return grid;
}
function parseMoves(string){
	return string.split("\n").filter(e=>e!=="").map(line=>{
		const [, move,, from,, to] = line.split(" ");
		return {crates: +move, from: from-1, to: to-1};
	});
}
function applyMove1(grid, move){
	const {crates, from, to} = move;
	const fromArr = grid[from];
	const toArr = grid[to];
	for(let i = 0; i < crates; i++){
		toArr.push(fromArr.pop());
	}
}
function applyMove2(grid, move){
	const {crates, from, to} = move;
	const fromArr = grid[from];
	const toArr = grid[to];
	toArr.push(...fromArr.slice(fromArr.length-crates));
	fromArr.splice(fromArr.length - crates, crates);
}

module.exports = (input)=>{
	const [gridStr, movesStr] = input.split("\n\n").filter(e=>e!=="");
	
	const grid1 = parseCrates(gridStr);
	const grid2 = grid1.map(line=>line.slice(0));

	const moves = parseMoves(movesStr);
	for(const move of moves){
		applyMove1(grid1, move);
		applyMove2(grid2, move);
	}

	return {
		part1: grid1.map(line=>line[line.length-1]).join(""),
		part2: grid2.map(line=>line[line.length-1]).join("")
	};
};