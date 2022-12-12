"use strict";
function searchDistinctChars(chars, length){
	let i = length;
	mainLoop:
	while(i < chars.length){
		const subChars = chars.slice(i-length, i);
		const hash = {};
		for(let charIndex = 0; charIndex < subChars.length; charIndex++){
			const char = subChars[charIndex];
			if(hash[char] !== undefined){
				i += charIndex;
				continue mainLoop;
			}else{
				hash[char] = charIndex;
			}
		}
		return i;
	}
	return 0;
}

module.exports = (input)=>{
	const characters = [...input.replace(/[\r\n]+/gm, "")];
	return {
		part1: searchDistinctChars(characters, 4),
		part2: searchDistinctChars(characters, 14)
	};
};