"use strict";
class Dir{
	static directories = [];
	constructor(name, parent){
		Dir.directories.push(this);
		this.name = name;
		this.parent = parent;
		this.files = [];
		this.dirs = {};
		this.size = -1;
	}
	addFile(file){
		this.files.push(file);
	}
	addDir(dir){
		this.dirs[dir.name] = dir;
	}
	getSize(){
		if(this.size === -1){
			this.size = this.files.map(file=>file.size).reduce((a, b)=>a+b, 0);
			this.size += Object.values(this.dirs).map(dir=>dir.getSize()).reduce((a, b)=>a+b, 0);
		}
		return this.size;
	}
}
class File{
	static files = [];
	constructor(name, size){
		File.files.push(this);
		this.name = name;
		this.size = size;
	}
}

function parseTerminal(lines){
	const root = new Dir("/");
	let cur;
	for(const line of lines){
		const [A, B, C] = line.split(" ");
		if(A === "$"){
			if(B === "cd"){
				switch(C){
					case "..": cur = cur.parent; break;
					case "/": cur = root; break;
					default: cur = cur.dirs[C]; break;
				}
			}
		}else{
			if(A === "dir"){
				cur.addDir(new Dir(B, cur));
			}else{
				cur.addFile(new File(B, +A));
			}
		}
	}
	return root;
}
function freeSpace(spaceToFree, root){
	let bestDir = root;
	for(const dir of Dir.directories){
		if(dir.getSize() >= spaceToFree && dir.getSize() < bestDir.getSize()){
			bestDir = dir;
		}
	}
	return bestDir;
}

module.exports = (input)=>{
	const deviceRoot = parseTerminal(input.split("\n").filter(e=>e!==""));
	const spaceToFree = 30000000 - (70000000 - deviceRoot.getSize());
	return {
		part1: Dir.directories.map(dir=>dir.getSize()).filter(size=>size<=100000).reduce((a, b)=>a+b, 0),
		part2: freeSpace(spaceToFree, deviceRoot).getSize()
	};
};