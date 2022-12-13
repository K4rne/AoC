"use strict";
const isArr = a=>a instanceof Array;

function Compare(lVal, rVal){
	if(lVal === rVal){
		return undefined;
	}else if(lVal === undefined || rVal === undefined){
		return lVal === undefined;
	}else if(isArr(lVal) && isArr(rVal)){
		const maxI = Math.max(lVal.length, rVal.length);
		for(let i = 0; i < maxI; i++){
			const result = Compare(lVal[i], rVal[i]); 
			if(result === undefined){continue;}
			return result;
		}
	}else if(isArr(lVal) || isArr(rVal)){
		return Compare(
			isArr(lVal) ? lVal : [lVal],
			isArr(rVal) ? rVal : [rVal]
		);
	}else{
		return lVal < rVal;
	}
}

module.exports = (input)=>{
	const pairs = input.split("\n\n").map(pairs=>pairs.split("\n").filter(e=>e!=="").map(arr=>JSON.parse(arr)));

	const divPacketStart = [[2]];
	const divPacketEnd = [[6]];
	const packets = [divPacketStart, ...pairs.flat(1), divPacketEnd];
	packets.sort((a, b)=>Compare(a, b)?-1:1)

	return {
		part1: pairs.reduce((acc, pair, i)=>acc + (Compare(...pair) ? (i+1) : 0), 0),
		part2: (packets.indexOf(divPacketStart)+1) * (packets.indexOf(divPacketEnd)+1)
	};
};