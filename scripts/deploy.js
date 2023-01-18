const hre = require("hardhat");

async function main() {
 const SsToken = await hre.ethers.getContractFactory("SsToken");
 const sstoken = await SsToken.deploy(100000000,5);

 await sstoken.deployed();

 console.log("SsToken contract deployed at",sstoken.address);//0x0269e182c99a536dd81a79b5dda5123390DB5FD0
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
