const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting KramikAuth contract deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log(\`📝 Deploying contracts with account: \${deployer.address}\`);
  
  const KramikAuth = await ethers.getContractFactory("KramikAuth");
  console.log("📦 Deploying KramikAuth...");
  
  const kramikAuth = await KramikAuth.deploy();
  await kramikAuth.deployed();
  
  console.log("✅ KramikAuth deployed successfully!");
  console.log(\`📄 Contract address: \${kramikAuth.address}\`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});