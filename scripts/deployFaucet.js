const hre = require("hardhat");

async function main() {
 const Faucet = await hre.ethers.getContractFactory("Faucet");
 const faucet = await Faucet.deploy("0x0269e182c99a536dd81a79b5dda5123390DB5FD0");

 await faucet.deployed();

 console.log("Faucet contract deployed at",faucet.address);//0x54a6Cb8527e25f0270322c5d254A7E802dF4Da9E
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
