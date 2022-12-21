"use strict";
class Monkey{
	static operators = {
		"+": (a, b)=>a+b,
		"-": (a, b)=>a-b,
		"*": (a, b)=>a*b,
		"/": (a, b)=>a/b,
	}
	static instances = {};
	constructor(name, hint){
		this.name = name;
		const [monkeyA, operator, monkeyB] = hint.split(" ");
		if(operator === undefined){
			this.result = +monkeyA;
		}else{
			this.hint = {
				a: monkeyA,
				b: monkeyB,
				op: Monkey.operators[operator]
			}
		}
		Monkey.instances[this.name] = this;
	}
	resolve(){
		if(this.result === undefined){
			const {a, b, op} = this.hint;
			const result = op(
				Monkey.instances[a].resolve(),
				Monkey.instances[b].resolve()
			);
			if(!this.needHuman()){this.result = result;}
			return result;
		}else{
			return this.result;
		}
	}
	needHuman(){
		if(this.needHumanResult === undefined){
			if(this.result === undefined){
				this.needHumanResult =  Monkey.instances[this.hint.a].needHuman() || Monkey.instances[this.hint.b].needHuman();
			}else{
				this.needHumanResult = this.name === "humn";
			}
		}
		return this.needHumanResult;
	}
	searchHumanValue(maxSteps=100000){
		const monkeys = Monkey.instances;
		const monkeyA = monkeys[this.hint.a];
		const monkeyB = monkeys[this.hint.b];
		const startValue = monkeys.humn.result;

		let direction = 1;
		let guess = 1;
		let goodGuessesInARow = 0;
		let prevDiff = Infinity;
		let prevGuess = 1;

		for(let i = 0; i < maxSteps; i++){
			monkeys.humn.result = guess;

			const diff = Math.abs(monkeyA.resolve() - monkeyB.resolve());
			if(diff === 0){return guess;}

			if(diff === prevDiff && guess !== prevGuess){
				const nextGuess = (guess+prevGuess)/2|0;
				prevGuess = guess;
				guess = nextGuess;
			}else{
				if(diff <= prevDiff){
					goodGuessesInARow++;
					const incr = goodGuessesInARow > 5 ? (goodGuessesInARow-4)*(goodGuessesInARow-3) : (Math.random()*3|0)+1
					direction += (direction < 0) ? -incr : incr;
				}else{
					goodGuessesInARow = 0;
					direction = (direction < 0) ? 1 : -1;
				}
				prevGuess = guess;
				guess += direction;
			}
			
			prevDiff = diff;
		}
		monkeys.humn.result = startValue;
		throw new Error("human value not found");
	}
}
module.exports = (input)=>{
	input.split("\n").filter(e=>e!=="").forEach(line=>new Monkey(...line.split(": ")));
	return {
		part1: Monkey.instances.root.resolve(),
		part2: Monkey.instances.root.searchHumanValue()
	};
};