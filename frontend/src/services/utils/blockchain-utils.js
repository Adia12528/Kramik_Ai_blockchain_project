// Blockchain utility functions

// Format Ethereum address for display
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Validate Ethereum address
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Convert wei to ether
export const weiToEther = (wei) => {
  return Number(wei) / 1e18
}

// Convert ether to wei
export const etherToWei = (ether) => {
  return Number(ether) * 1e18
}

// Format transaction hash for display
export const formatTransactionHash = (hash) => {
  if (!hash) return ''
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

// Get blockchain explorer URL
export const getExplorerUrl = (hash, network = 'sepolia') => {
  const baseUrls = {
    mainnet: 'https://etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    goerli: 'https://goerli.etherscan.io'
  }
  
  const baseUrl = baseUrls[network] || baseUrls.sepolia
  return `${baseUrl}/tx/${hash}`
}

// Get block explorer address URL
export const getAddressExplorerUrl = (address, network = 'sepolia') => {
  const baseUrls = {
    mainnet: 'https://etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    goerli: 'https://goerli.etherscan.io'
  }
  
  const baseUrl = baseUrls[network] || baseUrls.sepolia
  return `${baseUrl}/address/${address}`
}

// Calculate gas price with buffer
export const calculateGasWithBuffer = (estimatedGas) => {
  return Math.floor(estimatedGas * 1.2) // 20% buffer
}

// Network configuration
export const NETWORK_CONFIGS = {
  sepolia: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  },
  mainnet: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  }
}

// Switch network in MetaMask
export const switchNetwork = async (network = 'sepolia') => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed')
  }

  const networkConfig = NETWORK_CONFIGS[network]
  if (!networkConfig) {
    throw new Error(`Unsupported network: ${network}`)
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        })
      } catch (addError) {
        throw new Error('Failed to add network to MetaMask')
      }
    } else {
      throw new Error('Failed to switch network')
    }
  }
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return Boolean(window.ethereum && window.ethereum.isMetaMask)
}

// Get current network
export const getCurrentNetwork = async () => {
  if (!window.ethereum) return null

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    return Object.keys(NETWORK_CONFIGS).find(
      key => NETWORK_CONFIGS[key].chainId === chainId
    ) || 'unknown'
  } catch (error) {
    console.error('Error getting current network:', error)
    return null
  }
}