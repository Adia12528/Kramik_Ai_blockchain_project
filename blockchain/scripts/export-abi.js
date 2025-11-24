const fs = require('fs');
const path = require('path');

/**
 * Script to automatically export contract ABIs to frontend
 * Run after compilation: node scripts/export-abi.js
 */

const contractNames = ['KramikAuth', 'KramikAcademicRecords'];

const artifactsDir = path.join(__dirname, '..', 'artifacts', 'contracts');
const frontendDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'contracts');

// Ensure frontend contracts directory exists
if (!fs.existsSync(frontendDir)) {
  fs.mkdirSync(frontendDir, { recursive: true });
  console.log('✅ Created frontend contracts directory');
}

contractNames.forEach(contractName => {
  try {
    const artifactPath = path.join(artifactsDir, `${contractName}.sol`, `${contractName}.json`);
    const outputPath = path.join(frontendDir, `${contractName}.json`);

    // Read artifact
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

    // Extract only ABI (frontend doesn't need bytecode)
    const abiOnly = {
      abi: artifact.abi,
      contractName: artifact.contractName
    };

    // Write to frontend
    fs.writeFileSync(outputPath, JSON.stringify(abiOnly, null, 2));
    
    console.log(`✅ Exported ${contractName} ABI to frontend`);
  } catch (error) {
    console.error(`❌ Failed to export ${contractName}:`, error.message);
  }
});

console.log('\n🎉 ABI export complete!');
console.log('📁 Location:', frontendDir);
