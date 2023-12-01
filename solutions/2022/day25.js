"use strict";
const digits = {"2": +2, "1": +1, "0": 0, "-": -1, "=": -2};
function snafuToNumber(snafu){
	let number = 0;
	let digitMult = 1;
	for(let i = 1; i <= snafu.length; i++){
		number += digitMult * digits[snafu[snafu.length-i]];
		digitMult *= 5;
	}
	return number;
}
function numberToSnafu(number){
	const chars = [];
	let digitMult = 1;
	let numberLeft = number;
	while(digitMult < number){digitMult *= 5;}
	while(digitMult >= 5){
		digitMult /= 5;
		let closestChar = "?";
		let closestValue = Infinity;
		for(const char of "210-="){
			const value = numberLeft - (digits[char] * digitMult);
			if(Math.abs(value) < Math.abs(closestValue)){
				closestChar = char;
				closestValue = value;
			}
		}
		chars.push(closestChar);
		numberLeft = closestValue;
	}
	return chars.join("");
}

module.exports = (input)=>{
	const lines = input.split("\n").filter(e=>e!=="");
	const sum = lines.map(snafu=>snafuToNumber(snafu)).reduce((a, b)=>a+b);
	return {
		part1: numberToSnafu(sum),
		part2: ""
	};
};