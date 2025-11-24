const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying KramikAcademicRecords contract...");

  const KramikAcademicRecords = await hre.ethers.getContractFactory("KramikAcademicRecords");
  const academicRecords = await KramikAcademicRecords.deploy();

  await academicRecords.deployed();

  console.log("✅ KramikAcademicRecords deployed to:", academicRecords.address);
  console.log("📋 Save this address in your .env file as VITE_ACADEMIC_CONTRACT_ADDRESS");
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const owner = await academicRecords.owner();
  const contractActive = await academicRecords.contractActive();
  
  console.log("   Owner:", owner);
  console.log("   Contract Active:", contractActive);
  
  console.log("\n🎉 Deployment complete!");
  console.log("\n📝 Next steps:");
  console.log("   1. Add to .env: VITE_ACADEMIC_CONTRACT_ADDRESS=" + academicRecords.address);
  console.log("   2. Update contract ABI in frontend/src/contracts/KramikAcademicRecords.json");
  console.log("   3. Connect wallet in dashboard to start recording on blockchain");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
