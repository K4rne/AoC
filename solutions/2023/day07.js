"use strict";
const sum = (a, b)=>a+b;
function parseHand(line){
	const [cards, bid] = line.split(" ");
	const count = {A: 0, K: 0, Q: 0, J: 0, T: 0, 9: 0, 8: 0, 7: 0, 6: 0, 5: 0, 4: 0, 3: 0, 2: 0};
	for(const card of cards){count[card]++;}
	const combo = Object.keys(count).map(key=>count[key]**2).reduce(sum);

	const jokers = count.J;
	count.J = 0;
	const keys = Object.keys(count);
	keys.sort((a, b)=>count[b]-count[a]);
	count[keys[0]] += jokers;
	const jokerCombo = keys.map(key=>count[key]**2).reduce(sum);
	
	return {cards, bid: +bid, combo, jokerCombo};
}
function getTotalWinnings(hands, comboKey, cardsStrength){
	hands.sort((a, b)=>{
		if(a[comboKey] === b[comboKey]){
			for(let i = 0; i < 5; i++){
				const diff = cardsStrength.indexOf(b.cards[i]) - cardsStrength.indexOf(a.cards[i]);
				if(diff !== 0){
					return diff;
				}
			}
		}
		return a[comboKey] - b[comboKey];
	});
	return hands.map(({bid}, i)=>bid*(i+1)).reduce(sum);
}

module.exports = (input)=>{
	const hands = input.split("\r\n").filter(e=>e!=="").map(parseHand);
	return {
		part1: getTotalWinnings(hands, "combo", "AKQJT98765432"),
		part2: getTotalWinnings(hands, "jokerCombo", "AKQT98765432J")
	};
};