const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('📦 Installing dependencies...\n')

try {
  // Install root dependencies
  console.log('Installing root dependencies...')
  execSync('npm install', { stdio: 'inherit' })

  // Install frontend dependencies
  console.log('\\nInstalling frontend dependencies...')
  execSync('npm install', { 
    cwd: path.join(__dirname, '..', 'frontend'),
    stdio: 'inherit' 
  })

  // Install backend dependencies
  console.log('\\nInstalling backend dependencies...')
  execSync('npm install', { 
    cwd: path.join(__dirname, '..', 'backend'),
    stdio: 'inherit' 
  })

  console.log('\\n✅ All dependencies installed successfully!')
  console.log('\\n🎉 Setup complete! Next steps:')
  console.log('   1. Copy .env.example to .env')
  console.log('   2. Configure your environment variables')
  console.log('   3. Run: npm run dev')
} catch (error) {
  console.error('\\n❌ Setup failed:', error)
}