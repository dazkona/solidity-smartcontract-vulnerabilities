// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PrivateVariables {

    uint public variable1 = 1234;
	bytes32 private password =  "secret-magic-word";

    constructor() {}

    function guestPassword(bytes32 _password) public returns (bool)
	{
        return _password == password;
    }
}