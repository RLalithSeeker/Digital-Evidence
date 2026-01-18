const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Evidence = await hre.ethers.getContractFactory("Evidence");
  const evidence = await Evidence.deploy();

  await evidence.waitForDeployment();
  const address = await evidence.getAddress();

  console.log("Evidence contract deployed to:", address);

  // Save Contract Address and ABI for Frontend
  const frontendDir = path.join(__dirname, '../../frontend/src/contracts');

  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const artifact = await hre.artifacts.readArtifact("Evidence");

  fs.writeFileSync(
    path.join(frontendDir, "Evidence-address.json"),
    JSON.stringify({ address: address }, undefined, 2)
  );

  fs.writeFileSync(
    path.join(frontendDir, "Evidence.json"),
    JSON.stringify(artifact, undefined, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
