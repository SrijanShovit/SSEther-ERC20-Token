const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("SsToken contract", function () {
  let Token;
  let ssToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 5;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("SsToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    ssToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {

    /*** Test for setting correct owner */
    it("Should set the correct owner", async function () {
      expect(await ssToken.owner()).to.equal(owner.address);
    });

    /*** Test to assign total supply of tokens till now to owner */
    it("Should assign total supply of tokens till now to owner", async function () {
      const ownerBalance = await ssToken.balanceOf(owner.address);
      expect(await ssToken.totalSupply()).to.equal(ownerBalance);

    });

    /*** Test for setting maximum cap supply during deployment */
    it("Should set maximum cap supply during deployment", async function () {
      const cap = await ssToken.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    /*** Test for setting blockReward to address provided during deplyment */
    it("Should set blockReward to address provided during deplyment", async function () {
      const blockReward = await ssToken.blockReward();
      expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions",function(){
    
    /*** Test for transfer of tokens between accounts */
    it("Should transfer tokens between accounts",async function(){
      //transfer 100 tokens from owner to addr1
      await ssToken.transfer(addr1.address,100);
      const addr1Balance = await ssToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      /*** Test for transfer of 25 tokens from addr1 to addr2 */
      //we use .connect(signer) to send txn from one account to another
      await ssToken.connect(addr1).transfer(addr2.address,25);
      const addr2Balance = await ssToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(25);
    });

    /*** Test for txn to fall if sender doesn't have enough tokens */
    it("Should fail if sender doesn't have enough tokens",async function(){
      const initialOwnerBalance = await ssToken.balanceOf(owner.address);

      //sending 1 eth from addr2(zero balance) to owner
      await expect(
        ssToken.connect(addr2).transfer(owner.address,1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      //Owner balance shouldn't be changed
      expect(await ssToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    /*** Test for balance updation after txn */
    it("Should update balances after txn",async function(){
      const initialOwnerBalance = await ssToken.balanceOf(owner.address);

      //Transfer 75 tokens from owner to addr1
      await ssToken.transfer(addr1.address,75);

      //Transfer another 46 tokens from owner to addr2
      await ssToken.transfer(addr2.address,46);

      //Check balances
      const finalOwnerBalance = await ssToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(121));

      const addr1Balance = await ssToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(75);

      const addr2Balance = await ssToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(46);
    });

    /*** Test to ensure change miner reward */
    it("Should change miner reward",async function(){
      const rewardForMiner = Number(parseInt(await ssToken.blockReward()).toString()[0]);
      await ssToken.changeBlockReward(3);
      const newReward = Number(parseInt(await ssToken.blockReward()).toString()[0]);
      console.log(typeof rewardForMiner,typeof newReward);
      console.log(rewardForMiner,newReward);
      expect(newReward).to.equal(rewardForMiner - 2);
    });

  });

});