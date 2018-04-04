const SHA256 = require('crypto-js/sha256');
class Transaction{

	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}

}
class Block{

	constructor(timestamp, transactions, previousHash = ''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash(){
		return SHA256(this.nonce + this.previousHash + this.timestamp + JSON.stringify(this.transaction)).toString();
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
		this.difficulty = 3;
		this.paddingTransactions = [];
		this.miningReward = 100; 
	}

	createGenesisBlock(){
		return new Block("01/01/2018", "Genesis Block", "0");
	}
	
	getLatestBlock(){
		return this.chain[this.chain.length -1 ];
	}

	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.paddingTransactions);
		block.mineBlock(this.difficulty);
		console.log("Block successfully mined!!");
		this.chain.push(block);

		this.paddingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}
/*	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}
*/	createTransaction(transaction){
		this.paddingTransactions.push(transaction);
	}

	getBalanceOfAddress(address){
		let balance = 0;
 
		for(const block of this.chain){
			for(const trans of block.transactions){
				if(trans.fromAddress === address){
					balance -= trans.amount;
				}

				if(trans.toAddress === address){
					balance += trans.amount; 
				}
			}
		}

		return balance; 
	}
	isChainValid(){
		for(let i = 1; i<this.chain.length;  i++){
			const currentBlock = this.chain[i];
			//console.log(JSON.stringify(currentBlock, null, 5));
			const previousBlock = this.chain[i-1];
			if(currentBlock.hash !== currentBlock.calculateHash()){
				console.log("Block "+i+" and "+(i-1)+"has problem!!");
				console.log("transaction is changed in "+i+"Block!!");
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

// test code!!!
let ranaCoin = new Bloackchain();
ranaCoin.createTransaction(new Transaction('address1','address2',100));
ranaCoin.createTransaction(new Transaction('address2','address3',50));
ranaCoin.createTransaction(new Transaction('address3','address1',25));


console.log("\nString the miner....");
ranaCoin.minePendingTransactions('ranahiren27');

console.log('\n balance of ranahire27 is ',ranaCoin.getBalanceOfAddress('ranahiren27'));

console.log("\nString the miner again....");
ranaCoin.minePendingTransactions('ranahiren27');



console.log('\n balance of ranahire27 is ',ranaCoin.getBalanceOfAddress('ranahiren27'));
