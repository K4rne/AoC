"use strict";
class Monkey{
	static operations = {
		"+": (A, B)=>A+B,
		"*": (A, B)=>A*B
	}
	constructor(lines){
		this.id = +lines[0].replace(/[A-z :]*/g, "");
		this.items = lines[1].slice(18).split(", ").map(BigInt);
		this.op = lines[2].slice(19).split(" ");
		this.divisor = BigInt(lines[3].slice(21));
		this.result = {
			true: +lines[4].slice(29),
			false: +lines[5].slice(30),
		}

		this.inspectedItems = 0;
	}
	inspectItems(monkeys, worryDivision){
		const commonDivisor = monkeys.map(monkey=>monkey.divisor).reduce((a, b)=>a*b);
		let item = this.items.shift();
		while(item !== undefined){
			const [A, op, B] = this.op;

			const newItem = Monkey.operations[op](
				(A === "old") ? item : BigInt(A),
				(B === "old") ? item : BigInt(B)
			)

			const divided = worryDivision ? newItem/BigInt(3) : newItem%commonDivisor;
			const throwId = this.result[divided%this.divisor === BigInt(0)];
			monkeys[throwId].items.push(divided);
			
			this.inspectedItems++;
			item = this.items.shift();
		}
	}
}

function simulate(rounds, worryDivision, input){
	const monkeys = input.split("\n\n").map(strMonkey=>new Monkey(strMonkey.split("\n").filter(e=>e!=="")));
	for(let round = 1; round <= rounds; round++){
		for(let id = 0; id < monkeys.length; id++){
			monkeys[id].inspectItems(monkeys, worryDivision);
		}
	}
	const inspectedItems = monkeys.map(monkey=>monkey.inspectedItems);
	inspectedItems.sort((a, b)=>b-a);
	return inspectedItems[0] * inspectedItems[1];
}

module.exports = (input)=>{
	return {
		part1: simulate(20, true, input),
		part2: simulate(10000, false, input)
	};
};