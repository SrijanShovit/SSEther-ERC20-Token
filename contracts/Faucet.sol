// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

interface IERC20 {
    function transfer(address to,uint amount) external returns(bool);
    function balanceOf(address account) external view returns (uint);
    event Transfer(address indexed from,address indexed to,uint value);
}

contract Faucet {

    address payable owner;
    IERC20 public token;
    uint withdrawalAmount = 10 * (10**18);
    uint public freezeTime = 1 minutes;

    mapping (address => uint) nextRequestTimeAllowed;

    event DepositFunds(address indexed from,uint indexed amount);
    event WithdrawFunds(address indexed from,uint indexed amount);


    constructor(address tokenAddress) payable {
        token = IERC20(tokenAddress);
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner,"Only the contract owner can call this function");
        _;
    }

    function requestTokens() public{
        require(msg.sender != address(0),"Request from an invalid address");
        require(token.balanceOf(address(this)) >= withdrawalAmount,"Insufficient funds in the faucet");
        require(block.timestamp >= nextRequestTimeAllowed[msg.sender],"You are making requests too soon! Kindly try later!");
        nextRequestTimeAllowed[msg.sender] = block.timestamp + freezeTime;
        token.transfer(msg.sender,withdrawalAmount);
    }

    receive() external payable{
        emit DepositFunds(msg.sender,msg.value);
    }

    function getBalance() external view returns(uint){
        return token.balanceOf(address(this));
    }

    function setWithdrawalAmount(uint amount) public onlyOwner{
        withdrawalAmount = amount * (10**18);
    }

    function setFreezeTime(uint newTime) public onlyOwner{
        freezeTime = newTime * 1 minutes;
    }

    //function for owner to stop faucet
    function withdrawAllFunds() external onlyOwner{
        emit WithdrawFunds(msg.sender,token.balanceOf(address(this)));
        token.transfer(msg.sender,token.balanceOf(address(this)));
    }


}

