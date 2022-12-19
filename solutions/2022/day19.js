"use strict";
class State{
	constructor(blueprint, time=0, resources={ore: 0, clay: 0, obsidian: 0, geode: 0}, robots={ore: 1, clay: 0, obsidian: 0, geode: 0}, skippedRobots=new Set()){
		this.blueprint = blueprint;
		this.time = time;
		this.resources = resources;
		this.robots = robots;
		this.skippedRobots = skippedRobots;
	}
	pruning(robots, maxTime){
		return robots.filter(robot=>!(
			this.skippedRobots.has(robot) ||
			this.resources[robot] >= ((this.blueprint.maxUsage[robot]-this.robots[robot])*(maxTime-this.time))
		));
	}
	getBuildableRobots(){
		const robots = [];
		for(const robot in this.robots){
			let enoughResources = true; 
			for(const resource in this.blueprint[robot]){
				if(this.resources[resource] < this.blueprint[robot][resource]){
					enoughResources = false;
					break;
				}
			}
			if(enoughResources){
				robots.push(robot);
			}
		}
		return robots;
	}
	getTimeUntilNewBuild(maxTime, buildableRobots){
		const robots = {...this.robots};
		const resources = {...this.resources};
		for(let i = this.time+1; i <= maxTime; i++){
			for(const resource in resources){
				resources[resource] += robots[resource];
			}
			for(const robot in robots){
				if(buildableRobots.includes(e=>e===robot)){continue;}
				if(this.skippedRobots.has(robot)){continue;}
				let enoughResources = true; 
				for(const resource in this.blueprint[robot]){
					if(resources[resource] < this.blueprint[robot][resource]){
						enoughResources = false;
						break;
					}
				}
				if(enoughResources){
					return i-this.time;
				}
			}
		}
		return maxTime-this.time;
	}
	next(maxTime){
		const buildableRobots = this.getBuildableRobots();
		const prunedRobots = this.pruning(buildableRobots, maxTime);
		const TimeUntilNewBuild = this.getTimeUntilNewBuild(maxTime, buildableRobots);
		return [
			this.wait(TimeUntilNewBuild, buildableRobots),
			...prunedRobots.map(robot=>this.build(robot))
		].filter(state=>state instanceof State);
	}
	wait(time, buildableRobots){
		if(time === 0){return;}

		const robots = this.robots;
		const resources = {...this.resources};
		for(const resource in resources){resources[resource] += this.robots[resource] * time;}
		const skippedRobots = new Set(this.skippedRobots);
		for(const robot of buildableRobots){skippedRobots.add(robot);}

		return new State(this.blueprint, this.time + time, resources, robots, skippedRobots);
	}
	build(robot){
		const robots = {...this.robots};
		const resources = {...this.resources};
		for(const resource in resources){resources[resource] += robots[resource];}
		for(const resource in this.blueprint[robot]){resources[resource] -= this.blueprint[robot][resource];}
		robots[robot] += 1;

		return new State(this.blueprint, this.time + 1, resources, robots, new Set());
	}
}
class Blueprint{
	constructor(id, a, b, c, d, e, f){
		this.id = id;

		this.ore = {ore: a};
		this.clay = {ore: b};
		this.obsidian = {ore: c, clay: d};
		this.geode = {ore: e, obsidian: f};

		this.maxUsage = {
			ore: Math.max(a, b, c, e),
			clay: d,
			obsidian: f,
			geode: Infinity
		};
	}
}

function getMaxGeodes(blueprint, maxTime){
	function optimisticSimulation(state){
		let robot = state.robots.geode;
		let geode = state.resources.geode;
		for(let i = state.time; i < maxTime; i++){
			geode += robot++;
		}
		return geode;
	}
	let maxGeodes = 0;
	function geodes(state){
		if(state.time === maxTime){
			maxGeodes = Math.max(maxGeodes, state.resources.geode);
			return state.resources.geode;
		}
		if(optimisticSimulation(state) < maxGeodes){return -Infinity;}
		return Math.max(...state.next(maxTime).map(state=>geodes(state)));
	}
	return geodes(new State(blueprint));
}

module.exports = (input)=>{
	const blueprints = input.split("\n").filter(e=>e!=="").map(line=>new Blueprint(...line.match(/\d+/g).map(Number)));
	return {
		part1: blueprints.map(bp=>getMaxGeodes(bp, 24)*bp.id).reduce((a, b)=>a+b, 0),
		part2: blueprints.slice(0, 3).map(bp=>getMaxGeodes(bp, 32)).reduce((a, b)=>a*b, 1)
	};
};