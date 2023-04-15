// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Payments
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Payments {

    address public contractOwner;

    constructor() {
        contractOwner = msg.sender;
    }

    function deposit() public payable {}
    
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function withdraw(address payable _to, uint _amnt) public {
        require(msg.sender == contractOwner);
        require(address(this).balance >= _amnt);
        _to.transfer(_amnt);
    }
}
