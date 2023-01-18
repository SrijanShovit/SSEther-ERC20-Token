// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

//both these contracts inherit from ERC20
contract SsToken is ERC20Capped,ERC20Burnable{

    address payable public owner;
    uint public blockReward;

    
    constructor(uint cap,uint reward) ERC20("SsToken","SSE") ERC20Capped(cap * (10 ** decimals())) {
        //mint/create the token and give all to deployer
        owner = payable(msg.sender);
        _mint(owner, 65000000 * (10 ** decimals()));
        blockReward = reward * (10 ** decimals());
    }

    function _mint(address account,uint amount) internal virtual override(ERC20Capped , ERC20){
        require(ERC20.totalSupply() + amount <= cap(),"ERC20Capped: cap exceeded");
        super._mint(account,amount);
    }
    modifier onlyOwner {
        require(msg.sender == owner,"Only owner can call this function");
        _;
    }

    function _mintMinerReward() internal{
        //coinbase gives address of miner adding new block to blockchain
        _mint(block.coinbase,blockReward);
    }

    function _beforeTokenTransfer(address from,address to,uint value) internal virtual override{
         if(from != address(0) && to != block.coinbase && block.coinbase != address(0)) {
            _mintMinerReward();
        }
        super._beforeTokenTransfer(from, to, value);
    
    }

    function changeBlockReward(uint newReward) public onlyOwner{
        blockReward = newReward * (10 ** decimals());
    }



    function destroy() public onlyOwner{
        selfdestruct(owner);
    }
}