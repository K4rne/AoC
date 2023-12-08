"use strict";
const gcd = (x, y)=>(y === 0 ? x : gcd(y, x % y));
const lcm = (...n)=>n.reduce((x, y)=>(x * y)/gcd(x, y));
function stepsToEnd(start, endsWith, movements, nodes){
	let [node, steps] = [start, 0];
	while(!node.endsWith(endsWith)){
		node = nodes[node][movements[steps++%movements.length]];
	}
	return steps;
}

module.exports = (input)=>{
	const [movements, ...nodesStr] = input.split("\r\n").filter(e=>e!=="");
	const nodes = {};
	for(const str of nodesStr){
		const [name, L, R] = str.split(/[ =(,)]+/g);
		nodes[name] = {L, R};
	}
	return {
		part1: stepsToEnd("AAA", "ZZZ", movements, nodes),
		part2: lcm(...Object.keys(nodes).filter(name=>name[2] === "A").map(name=>stepsToEnd(name, "Z", movements, nodes)))
	};
};