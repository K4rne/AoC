"use strict";
const digits = [..."0123456789"];
const spelledDigits = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
function getFirstAndLastDigit(line, useSpelledDigits){
	let first, last;
	for(let i = 0; i < line.length; i++){
		const startSlice = line.slice(i);
		const endSlice = line.slice(0, line.length-i);
		for(let digit = 0; digit < 10; digit++){
			if(first === undefined && (startSlice.startsWith(digits[digit]) || (useSpelledDigits && startSlice.startsWith(spelledDigits[digit])))){
				first = digit;
			}
			if(last === undefined && (endSlice.endsWith(digits[digit]) || (useSpelledDigits && endSlice.endsWith(spelledDigits[digit])))){
				last = digit;
			}
		}
		if(first !== undefined && last !== undefined){
			break;
		}
	}
	return first * 10 + last;
}
const sum = (a, b)=>a+b;
module.exports = (input)=>{
	const lines = input.split("\r\n").filter(e=>e!=="");
	return {
		part1: lines.map(line=>getFirstAndLastDigit(line, false)).reduce(sum),
		part2: lines.map(line=>getFirstAndLastDigit(line, true)).reduce(sum)
	};
};