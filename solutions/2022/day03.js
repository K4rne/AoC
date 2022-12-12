"use strict";
const priority = "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function splitInNArr(arr, n){
	return (n === 1) ? [arr] : [arr.slice(0, Math.floor(arr.length/n)), ...splitInNArr(arr.slice(Math.floor(arr.length/n)), n-1)];
}
function splitInArrOfN(arr, n){
	return (arr.length <= n) ? [arr] : [arr.slice(0, n), ...splitInArrOfN(arr.slice(n), n)];
}
function searchCommonItem(arrays){
	const n = arrays.length;
	const itemCount = [...Array(n)].map(_=>Array(53).fill(false));
	for(let i = 0; i < n; i++){
		for(const item of arrays[i]){
			itemCount[i][item] = true;
		}
	}
	for(let i = 1; i < 53; i++){
		for(let sum = 0, j = 0; j < n; j++){
			if(itemCount[j][i] && ++sum === n){
				return i;
			}
		}
	}
	throw new Error("common item not found");
}

module.exports = (input)=>{
	const rucksacks = input.split("\n").filter(e=>e!=="").map(chars=>[...chars].map(char=>priority.indexOf(char)));
	return {
		part1: rucksacks.map(rucksack=>searchCommonItem(splitInNArr(rucksack, 2))).reduce((a, b)=>a+b),
		part2: splitInArrOfN(rucksacks, 3).map(rucksacks=>searchCommonItem(rucksacks)).reduce((a, b)=>a+b)
	}
}