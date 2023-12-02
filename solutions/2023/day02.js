"use strict";
const sum = (a, b)=>a+b;
const rules = {r: 12, g: 13, b: 14};
function gameIsPossible(game){
	return !game.some(set=>set.red > rules.r || set.green > rules.g || set.blue > rules.b);
}
function getMinCubesScore(game){
	let [r, g, b] = [0, 0, 0];
	for(const set of game){
		r = Math.max(r, set.red|0);
		g = Math.max(g, set.green|0);
		b = Math.max(b, set.blue|0);
	}
	return r * g * b;
}

module.exports = (input)=>{
	const games = input.split("\r\n").filter(e=>e!=="").map(line=>
		line.split(": ")[1].split("; ").map(set=>{
			const colors = {};
			for(const cubes of set.split(", ")){
				const [count, color] = cubes.split(" ");
				colors[color] = +count;
			}
			return colors;
		})
	);
	return {
		part1: games.map((game, id)=>gameIsPossible(game) ? id+1 : 0).reduce(sum),
		part2: games.map(game=>getMinCubesScore(game)).reduce(sum)
	};
};