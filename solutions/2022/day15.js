"use strict";
class Interval{
	constructor(start, end){
		this.start = start;
		this.end = end;
	}
	contain(interval){
		const [A, B] = this.start < interval.start ? [this, interval] : [interval, this];
		return (A.end+1) >= B.start;
	}
	merge(interval){
		this.start = Math.min(this.start, interval.start);
		this.end = Math.max(this.end, interval.end);
		interval.obsolete = true;
	}
	length(){
		return this.end-this.start;
	}
}
class IntervalMerger{
	constructor(){
		this.intervals = [];
	}
	add(interval){
		this.intervals.push(interval);
		this.merge();
	}
	merge(){
		const intervals = this.intervals;
		for(let i = 0; i < intervals.length-1; i++){
			const A = intervals[i];
			for(let j = i+1; j < intervals.length; j++){
				const B = intervals[j];
				if(A.contain(B) && !A.obsolete && !B.obsolete){
					A.merge(B);
					i = -1;
					break;
				}
			}
		}
		this.intervals = intervals.filter(e=>!e.obsolete);
	}
	totalLength(){
		return 1 + this.intervals.map(interval=>interval.length()).reduce((a, b)=>a+b, 0);
	}
}
class Sensor{
	constructor(sX, sY, bX, bY){
		this.x = sX;
		this.y = sY;
		this.size = Math.abs(sX-bX) + Math.abs(sY-bY);
	}
	contain(x, y){
		const dist = Math.abs(this.x-x) + Math.abs(this.y-y);
		return dist <= this.size;
	}
	
}

function countNoBeaconPos(sensors, goalY){
	const noBeaconIntervals = new IntervalMerger();
	const beaconsAtY = new Set();
	for(const [sX, sY, bX, bY] of sensors){
		if(bY === goalY){beaconsAtY.add(bX);}
		const dist = Math.abs(sX-bX) + Math.abs(sY-bY);
		const widthAtGoal = 1+(dist-Math.abs(sY-goalY))*2;
		if(widthAtGoal <= 0){continue}
		const offset = sX-(widthAtGoal-1)/2;
		const interval = new Interval(offset, offset+(widthAtGoal-1));
		noBeaconIntervals.add(interval);
	}
	return noBeaconIntervals.totalLength() - beaconsAtY.size;
}
function searchDistressBeacon(sensors_old, max){
	const sensors = sensors_old.map(s=>new Sensor(...s));
	sensors.sort((a, b)=>b.size-a.size);
	for(const sensor of sensors){
		const {x, y, size} = sensor;
		const borderSize = size+1;
		for(let i = 0; i < borderSize; i++){
			const [distressBeacon] = [
				[x+i, y-borderSize+i],
				[x+borderSize-i, y+i],
				[x-i, y+borderSize-i],
				[x-borderSize+i, y-i],
			]
			.filter(([x, y])=>!sensors.some(sensor=>sensor.contain(x, y)))
			.filter(([x, y])=>
				[
					[x-1, y],
					[x+1, y],
					[x, y-1],
					[x, y+1]
				].every(([nX, nY])=>sensors.some(sensor=>sensor.contain(nX, nY)))
			)
			if(distressBeacon !== undefined){
				return distressBeacon;
			}
		}
	}
	throw new Error("distress beacon not found");
}
function tuningFrequency(x, y){
	return x * 4000000 + y;
}

module.exports = (input)=>{
	const sensors = input.split("\n").filter(e=>e!=="").map(line=>line.match(/[0-9]+/g).map(Number));
	return {
		part1: countNoBeaconPos(sensors, 2000000),
		part2: tuningFrequency(...searchDistressBeacon(sensors, 4000000))
	};
};