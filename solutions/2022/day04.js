"use strict";
function isFullyOverlapping(pair){
	const [[startA, endA], [startB, endB]] = pair;
	return (startA <= startB && endB <= endA) || (startB <= startA && endA <= endB);
}
function isOverlapping(pair){
	const [[startA, endA], [startB, endB]] = pair;
	return Math.max(startA, startB) <= Math.min(endA, endB);
}

module.exports = (input)=>{
	const pairs = input.split("\n").filter(e=>e!=="").map(pair=>pair.split(",").map(range=>range.split("-").map(e=>+e)));
	return {
		part1: pairs.map(isFullyOverlapping).filter(Boolean).length,
		part2: pairs.map(isOverlapping).filter(Boolean).length
	};
}