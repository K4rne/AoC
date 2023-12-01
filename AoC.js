"use strict";
const fs = require("fs");

const year = process.argv[2].padStart(4, "0");
const day = process.argv[3].padStart(2, "0");

const solutionPath = `./solutions/${year}/day${day}.js`;
const inputPath = `./inputs/${year}/day${day}.txt`;

const solution = require(solutionPath);
const input = fs.readFileSync(inputPath, {encoding:"utf8", flag:"r"});

const {part1, part2} = solution(input);
console.log("part1:", part1);
console.log("part2:", part2);