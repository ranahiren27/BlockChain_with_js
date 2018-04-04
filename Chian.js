const SHA256 = require('crypto-js/sha256');
class Block{
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash(){
		return SHA256(this.nonce + this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	} 

	mineBlock(difficulty){
		//proof of work
		while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
			this.hash = this.calculateHash();
			this.nonce++;
		}

		console.log("Block mined: " + this.hash);
	
	}
}

class Bloackchain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5;
	}

	createGenesisBlock(){
		return new Block(0, "01/01/2018", "Genesis Block", "0");
	}
	
	getLatestBlock(){
		return this.chain[this.chain.length -1 ];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isChainValid(){
		for(let i = 1; i<this.chain.length;  i++){
			const currentBlock = this.chain[i];
			//console.log(JSON.stringify(currentBlock, null, 5));
			const previousBlock = this.chain[i-1];
			if(currentBlock.hash !== currentBlock.calculateHash()){
				console.log("Block "+i+" and "+(i-1)+"has problem!!");
				console.log("data is changed in "+i+"Block!!");
				return false;
			}

			if(currentBlock.previousHash !== previousBlock.hash){
				console.log("Block "+i+" and "+(i-1)+"has problem!!");
				console.log("previousHash is not matching!!");
				return false;
			}
		}

		return true;
	}

}


let ranaCoin = new Bloackchain();
console.log("Mining block 1....");
ranaCoin.addBlock(new Block(1,"11/01/2018",{amount: 23}));
console.log("Mining block 2....");
ranaCoin.addBlock(new Block(2,"12/01/2018",{amount: 243}));
console.log("Mining block 3....");
ranaCoin.addBlock(new Block(3,"13/01/2018",{amount: 3}));
console.log("Mining block 4....");
ranaCoin.addBlock(new Block(4,"14/01/2018",{amount: 2}));
console.log("Mining block 5....");
ranaCoin.addBlock(new Block(5,"15/01/2018",{amount: 230}));

