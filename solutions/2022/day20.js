"use strict";
class Node{
	constructor(value){
		this.value = value;
		this.next;
	}
	moveTo(distance, forward){
		if(distance === 0){return;}
		this.prev.next = this.next;
		this.next.prev = this.prev;
		if(forward){
			let futurePrev = this.next;
			for(let i = 1; i < distance; i++){
				futurePrev = futurePrev.next;
			}
			this.prev = futurePrev;
			this.next = futurePrev.next;
		}else{
			let futureNext = this.prev;
			for(let i = 1; i < distance; i++){
				futureNext = futureNext.prev;
			}
			this.next = futureNext;
			this.prev = futureNext.prev;
		}
		this.prev.next = this;
		this.next.prev = this;
	}
}
class LinkedList{
	constructor(head){
		this.head = head;
		this.size = 0;
	}
	toArray(){
		const array = [this.head.value];
		let current = this.head;
		while(current.next !== this.head){
			current = current.next;
			array.push(current.value);
		}
		return array;
	}
}

function toLinkedList(array){
	const nodes = Array(array.length);
	let prev;
	for(let i = 0; i < array.length; i++){
		const value = array[i];
		const node = new Node(value);
		nodes[i] = node;
		if(prev){
			prev.next = node;
			node.prev = prev;
		}
		prev = node;
	}
	const first = nodes[0];
	prev.next = first;
	first.prev = prev;
	return [new LinkedList(nodes.find((a)=>a.value===0)), nodes];
}
function mix(start, time){
	const [linkedList, order] = toLinkedList(start);
	for(let i = 0; i < time; i++){
		for(const node of order){
			if(node.value === 0){continue;}
			const dist = Math.abs(node.value);
			node.moveTo(dist % (order.length-1), node.value > 0);
		}
	}
	return linkedList.toArray();
}

module.exports = (input)=>{
	const numbers = input.split("\n").filter(e=>e!=="").map(Number);
	const key = 811589153;
	const mixedEncrypted = mix(numbers, 1);
	const mixedDecrypted = mix(numbers.map(n=>n*key), 10);
	return {
		part1: [...Array(3)].map((_, i)=>mixedEncrypted.at((mixedEncrypted.indexOf(0) + (i + 1) * 1000) % mixedEncrypted.length)).reduce((a, b)=>a+b),
		part2: [...Array(3)].map((_, i)=>mixedDecrypted.at((mixedDecrypted.indexOf(0) + (i + 1) * 1000) % mixedDecrypted.length)).reduce((a, b)=>a+b)
	};
};