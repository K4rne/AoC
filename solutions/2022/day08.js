"use strict";
function updateVisibility(treeGrid){
	const size = treeGrid.length;
	function updateLine(x, y, xOffset, yOffset){
		let visibilityLevel = -1;
		while(x >= 0 && y >= 0 && x < size && y < size){
			const tree = treeGrid[y][x];

			tree.visible = tree.visible || visibilityLevel < tree.height;
			visibilityLevel = Math.max(visibilityLevel, tree.height);

			x += xOffset;
			y += yOffset;
		}
	}
	const maxI = size-1;
	for(let i = 1; i < size; i++){
		updateLine(i, 0, 0, 1);
		updateLine(maxI, i, -1, 0);
		updateLine(maxI-i, maxI, 0, -1);
		updateLine(0, maxI-i, 1, 0);
	}
}
function updateScore(treeGrid){
	const size = treeGrid.length;
	function getScore(x, y){
		function getLineScore(x, y, xOffset, yOffset){
			const tree = treeGrid[y][x];
			let score = 0;
			do{
				x += xOffset;
				y += yOffset;
				if(!(x >= 0 && y >= 0 && x < size && y < size)){break;}
				score++;
			}while(treeGrid[y][x].height < tree.height)
			return score;
		}
		return getLineScore(x, y, 1, 0) * getLineScore(x, y, -1, 0) * getLineScore(x, y, 0, 1) * getLineScore(x, y, 0, -1);
	}
	for(let y = 0; y < size; y++){
		for(let x = 0; x < size; x++){
			treeGrid[y][x].score = getScore(x, y);
		}
	}
}

module.exports = (input)=>{
	const treeGrid = input.split("\n").filter(line=>line!=="").map((line, y)=>[...line].map((height, x)=>({height, visible: false, score: 0})));

	updateVisibility(treeGrid);
	updateScore(treeGrid);
	
	const flatTreeGrid = treeGrid.flat(1);
	flatTreeGrid.sort((a, b)=>b.score-a.score);
	
	return {
		part1: flatTreeGrid.filter(cell=>cell.visible).length,
		part2: flatTreeGrid[0].score
	};
};