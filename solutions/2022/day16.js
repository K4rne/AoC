"use strict";
class Valve{
	static instances = {};
	constructor(string){
		const [name, flow, tunnels] = string.split(/Valve | has flow rate=|; tunnels? leads? to valves? /g).filter(e=>e!=="");
		this.name = name;
		this.flow = +flow;
		this.tunnels = tunnels.split(", ");
		this.distances = {};

		Valve.instances[name] = this;
	}
	updateTunnels(){
		this.tunnels = this.tunnels.map(name=>Valve.instances[name]);
		this.tunnels.sort((a, b)=>b.flow-a.flow);
	}
	updateDistances(){
		this.distances[this.name] = 0;
		const visited = new Set();
		const queue = [[this, 0]];
		while(queue.length){
			const [cur, dist] = queue.shift();
			visited.add(cur);
			for(const tunnel of cur.tunnels){
				if((this.distances[tunnel.name] ?? Infinity) > this.distances[cur.name]+1){
					this.distances[tunnel.name] = this.distances[cur.name]+1;
				}
				if(!visited.has(tunnel)){
					queue.push([tunnel, dist+1]);
				}
			}
		}
		this.valves = Object.values(Valve.instances).filter(valve=>valve.flow > 0 && valve !== this);
		//this.valves.sort((a, b)=>(b.flow)-(a.flow));
		//this.valves.sort((a, b)=>(this.distances[a.name])-(this.distances[b.name]));
		this.valves.sort((a, b)=>((b.flow+3)/(this.distances[b.name]*10))-((a.flow+3)/(this.distances[a.name]*10)));
	}
	toString(){
		return `Valve {name: ${this.name}, flow: ${this.flow}}`;
	}
}
class Move{
	constructor(type, position){
		this.type = type;
		this.position = position;
	}
}
class SearcherState{
	constructor(position, minute, path=[], visited=new Set()){
		this.position = position;
		this.minute = minute;
		this.path = path;
		this.visited = visited;

		this.visited.add(position);
	}
	walk(position){
		const dist = this.position.distances[position.name];
		return new SearcherState(
			position,
			this.minute - dist,
			[...this.path, ...[...Array(dist)].map(_=>new Move("walk", this.position))],
			new Set(this.visited)
		);
	}
	open(){return new SearcherState(this.position, this.minute-1, [...this.path, new Move("open", this.position)], new Set()   );}
	wait(){return new SearcherState(this.position, this.minute-1, [...this.path, new Move("wait", this.position)], this.visited);}
}

function searchMostPressure(valves, minute, searcherCount){
	const maxFlow = valves.map(valve=>valve.flow).reduce((a, b)=>a+b, 0);
	let maxPressure = 0;
	function recursiveSearch(searchers, minute, openValves, pressure=0){
		if(minute === 0){
			if(pressure > maxPressure){
				maxPressure = pressure;
			}
			return pressure;
		}

		const searchersToMove = searchers.filter(s=>s.minute >= minute);
		const minNotFinished = searchersToMove.length > 1;

		const nextSearchers = searchers.slice(0);
		const nextMinute = minute - (minNotFinished ? 0 : 1);
		const nextOpenValves = openValves.slice(0);
		const nextPressure = minNotFinished ? pressure : (pressure + openValves.map(v=>v.flow).reduce((a, b)=>a+b, 0));

		if(searchersToMove.length === 0){return recursiveSearch(nextSearchers, nextMinute, nextOpenValves, nextPressure);}
		if(nextPressure + (minute-1)*maxFlow < maxPressure){return -1;}

		const searcher = searchersToMove[0];
		const searcherIndex = nextSearchers.indexOf(searcher);

		let bestScore = -Infinity;

		if(searcher.position.flow > 0 && !openValves.includes(searcher.position)){
			nextOpenValves.push(searcher.position);
			nextSearchers[searcherIndex] = searcher.open();
			const score = recursiveSearch(nextSearchers, nextMinute, nextOpenValves,
				minNotFinished ? nextPressure - (searchersToMove.length-1)*searcher.position.flow : nextPressure
			);
			if(score > bestScore){bestScore = score;}
			nextOpenValves.pop();
		}else{
			for(const valve of searcher.position.valves){
				if(searcher.visited.has(valve)){continue;}
				if(minute - searcher.position.distances[valve.name] < 0){continue;}
				if(openValves.includes(valve)){continue;}
				if(searchers.some(s=>s.position === valve)){continue;}
				
				nextSearchers[searcherIndex] = searcher.walk(valve);
				const score = recursiveSearch(nextSearchers, nextMinute, nextOpenValves, nextPressure);
				if(score > bestScore){bestScore = score;}
			}
		}
		if(bestScore === -Infinity){
			nextSearchers[searcherIndex] = searcher.wait();
			const score = recursiveSearch(nextSearchers, nextMinute, nextOpenValves, nextPressure);
			if(score > bestScore){bestScore = score;}
		}

		return bestScore;
	}
	return recursiveSearch([...Array(searcherCount)].map(_=>new SearcherState(Valve.instances.AA, minute)), minute, []);
}

module.exports = (input)=>{
	const valves = input.split("\n").filter(e=>e!=="").map(line=>new Valve(line));

	valves.forEach(valve=>valve.updateTunnels());
	valves.forEach(valve=>valve.updateDistances());

	return {
		part1: searchMostPressure(valves, 30, 1),
		part2: searchMostPressure(valves, 26, 2)
	};
};