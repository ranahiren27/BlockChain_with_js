const SHA256 = require('crypto-js/sha256');
class Block{
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class Bloackchain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock(){
		return new Block(0, "01/01/2018", "Genesis Block", "0");
	}
	
	getLatestBlock(){
		return this.chain[this.chain.length -1 ];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
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
ranaCoin.addBlock(new Block(1,"11/01/2018",{amount: 23}));
ranaCoin.addBlock(new Block(2,"12/01/2018",{amount: 243}));
ranaCoin.addBlock(new Block(3,"13/01/2018",{amount: 3}));
ranaCoin.addBlock(new Block(4,"14/01/2018",{amount: 2}));
ranaCoin.addBlock(new Block(5,"15/01/2018",{amount: 230}));

//console.log(JSON.stringify(ranaCoin, null, 5)); 

console.log("is BlockChian valid? "+ranaCoin.isChainValid());
console.log("After chaging hashh\n");
ranaCoin.chain[1].data = {amount: 2000};
ranaCoin.chain[1].hash = ranaCoin.chain[1].calculateHash();
ranaCoin.chain[2].previousHash = ranaCoin.chain[1].hash;
console.log("is BlockChian valid? "+ranaCoin.isChainValid());
