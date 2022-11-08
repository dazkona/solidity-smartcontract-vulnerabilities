// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
	const ReentrancyVictim = await hre.ethers.getContractFactory("ReentrancyVictim");
	const reentrancyVictim = await ReentrancyVictim.deploy();
	await reentrancyVictim.deployed();
	console.log(`ReentrancyVictim deployed to ${reentrancyVictim.address}`);

	const ReentrancyAttacker = await hre.ethers.getContractFactory("ReentrancyAttacker");
	const reentrancyAttacker = await ReentrancyAttacker.deploy();
	await reentrancyAttacker.deployed();
	console.log(`ReentrancyAttacker deployed to ${reentrancyAttacker.address}`);  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});