const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Faucet contract", function () {
    let tokenAddress = "0x0269e182c99a536dd81a79b5dda5123390DB5FD0";
    let addr1,addr2,Faucet,faucet;
  
    beforeEach(async function () {
      Faucet = await ethers.getContractFactory("Faucet");
      [owner, addr1, addr2] = await hre.ethers.getSigners();
      faucet = await Faucet.deploy(tokenAddress);
    });

    describe("Resetting parameters",function(){

        /*** Test to reset withdrawal period */
        it("Should set the new withdrawal amount from faucet",async function(){
            const newTime = 1*24*3600;
            console.log(parseInt(await faucet.freezeTime()),newTime);
            await faucet.setFreezeTime(newTime);
            console.log(parseInt(await faucet.freezeTime()),newTime);
            console.log(typeof parseInt(await faucet.freezeTime()),typeof newTime);
            expect(parseInt(await faucet.freezeTime())).to.equal(newTime*60);
        });
    })


   

});