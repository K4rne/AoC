"use strict";
const evenIdx = (_, i)=>i%2===0;
const oddIdx = (_, i)=>i%2===1;
class Range{
	constructor(start, length){
		this.length = Math.max(0, length);
		this.updateStart(start);
	}
	updateStart(start){
		this.start = start;
		this.end = start + (this.length-1);
	}
	cut(range){
		const [A, B] = [range, this];
		const before = new Range(A.start, Math.min(A.length, B.start-A.start));
		const overlap = new Range(Math.max(A.start, B.start), 1 + Math.min(A.end, B.end) - Math.max(A.start, B.start));
		const after = new Range(Math.max(A.start, B.end + 1), Math.min(A.length, A.end-B.end));
		return [before, overlap, after];
	}
}
function getBestLocation(seeds, count, maps){
	function recursiveSearch(range, depth=0){
		if(depth === maxDepth){
			bestLocation = Math.min(bestLocation, range.start);
			return;
		}else{
			const usedRanges = [];
			let unusedRanges = [range];
			for(const map of maps[depth]){
				let nextUnusedRanges = [];
				for(const range of unusedRanges){
					const [before, overlap, after] = map.range.cut(range);
					if(before.length > 0){nextUnusedRanges.push(before);}
					if(after.length > 0){nextUnusedRanges.push(after);}
					if(overlap.length > 0){
						overlap.updateStart(overlap.start + map.offset);
						usedRanges.push(overlap);
					}
				}
				unusedRanges = nextUnusedRanges;
			}
			usedRanges.push(...unusedRanges);
			usedRanges.forEach(range=>recursiveSearch(range, depth+1));
		}
	}
	const maxDepth = maps.length;
	let bestLocation = Infinity;
	seeds.forEach((seed, i)=>recursiveSearch(new Range(seed, count[i])));
	return bestLocation;
}

module.exports = (input)=>{
	const [seedsStr, ...mapsStr] = input.split("\r\n\r\n").map(lines=>lines.split("\r\n").filter(e=>e!==""));
	const seeds = seedsStr[0].slice(7).split(" ").map(n=>+n);
	const maps = mapsStr.map(([, ...numbersStr])=>
		numbersStr.map(numbers=>{
			const [to, from, length] = numbers.split(" ").map(n=>+n);
			return {offset: to - from, range: new Range(from, length)};
		})
	);
	return {
		part1: getBestLocation(seeds, seeds.map(_=>1), maps),
		part2: getBestLocation(seeds.filter(evenIdx), seeds.filter(oddIdx), maps)
	};
};