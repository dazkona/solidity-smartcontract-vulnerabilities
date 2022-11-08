const { time,loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const web3 = require("web3");

describe("Private variables", function () {

	it("Try to read what is hidden", async function () {

		// Deploy the victim contract
		const PrivateVariablesFactory = await ethers.getContractFactory("PrivateVariables");
		const privateVariables = await PrivateVariablesFactory.deploy();
		await privateVariables.deployed();

		// You can access what is stored on each slot, not matter if it's set as private
		const mistery = await ethers.provider.getStorageAt(privateVariables.address, 1);
		console.log(web3.utils.hexToAscii(mistery));
	});

});