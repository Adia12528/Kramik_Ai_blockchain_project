import Web3 from 'web3'
import KramikAuthABI from '../contracts/KramikAuth.json'
import KramikAcademicRecordsABI from '../contracts/KramikAcademicRecords.json'

class BlockchainService {
  constructor() {
    this.web3 = null
    this.contract = null
    this.academicContract = null
    this.currentAccount = null
    this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
    this.academicContractAddress = import.meta.env.VITE_ACADEMIC_CONTRACT_ADDRESS
  }

  async connectWallet() {
    if (window.ethereum) {
      try {
        this.web3 = new Web3(window.ethereum)
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        // Get accounts
        const accounts = await this.web3.eth.getAccounts()
        this.currentAccount = accounts[0]
        
        // Initialize contract
        this.initializeContract()
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          this.currentAccount = accounts[0] || null
          if (accounts.length === 0) {
            console.log('Please connect to MetaMask.')
          }
        })
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload()
        })
        
        return this.currentAccount
      } catch (error) {
        throw new Error('Wallet connection failed: ' + error.message)
      }
    } else {
      throw new Error('Please install MetaMask!')
    }
  }

  initializeContract() {
    if (!this.web3 || !this.contractAddress) return

    this.contract = new this.web3.eth.Contract(
      KramikAuthABI.abi,
      this.contractAddress
    )

    // Initialize academic records contract
    if (this.academicContractAddress) {
      this.academicContract = new this.web3.eth.Contract(
        KramikAcademicRecordsABI.abi,
        this.academicContractAddress
      )
    }
  }

  async signMessage(message) {
    if (!this.web3 || !this.currentAccount) {
      throw new Error('Wallet not connected')
    }

    try {
      const signature = await this.web3.eth.personal.sign(
        Web3.utils.fromUtf8(message),
        this.currentAccount,
        '' // No password needed for MetaMask
      )
      return signature
    } catch (error) {
      throw new Error('Message signing failed: ' + error.message)
    }
  }

  async verifyStudentRegistration(studentData) {
    if (!this.contract || !this.currentAccount) {
      throw new Error('Contract not initialized')
    }

    try {
      // Create student hash from data
      const studentHash = this.web3.utils.sha3(
        JSON.stringify({
          email: studentData.email,
          enrollmentId: studentData.enrollmentId,
          name: studentData.name,
          timestamp: Date.now()
        })
      )

      const transaction = await this.contract.methods
        .registerStudent(studentHash, this.currentAccount)
        .send({ 
          from: this.currentAccount,
          gas: 300000 
        })

      return transaction
    } catch (error) {
      throw new Error('Blockchain registration failed: ' + error.message)
    }
  }

  async getStudentRecord(studentAddress) {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      return await this.contract.methods
        .getStudentRecord(studentAddress)
        .call()
    } catch (error) {
      throw new Error('Failed to get student record: ' + error.message)
    }
  }

  async verifyStudent(studentAddress) {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      return await this.contract.methods
        .verifyStudent(studentAddress)
        .call()
    } catch (error) {
      throw new Error('Verification failed: ' + error.message)
    }
  }

  async getContractStats() {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const studentCount = await this.contract.methods.studentCount().call()
      const adminCount = await this.contract.methods.adminCount().call()
      const owner = await this.contract.methods.owner().call()

      return {
        studentCount: parseInt(studentCount),
        adminCount: parseInt(adminCount),
        owner
      }
    } catch (error) {
      throw new Error('Failed to get contract stats: ' + error.message)
    }
  }

  // Utility method to format address
  formatAddress(address) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Check if connected to correct network
  async checkNetwork() {
    if (!this.web3) return false

    const chainId = await this.web3.eth.getChainId()
    const targetChainId = import.meta.env.VITE_BLOCKCHAIN_NETWORK === 'sepolia' ? 11155111 : 1

    return chainId === targetChainId
  }

  // ============ ACADEMIC RECORDS METHODS ============

  /**
   * Record quiz submission on blockchain
   */
  async recordQuizOnBlockchain(quizData) {
    if (!this.academicContract || !this.currentAccount) {
      throw new Error('Academic contract not initialized or wallet not connected')
    }

    try {
      const { subjectCode, questions, answers, score, totalQuestions } = quizData

      // Create hash of quiz questions
      const quizHash = this.web3.utils.sha3(
        JSON.stringify({
          subjectCode,
          questions: questions.map(q => q.question),
          timestamp: Date.now()
        })
      )

      // Create hash of student answers
      const answerHash = this.web3.utils.sha3(
        JSON.stringify({
          answers,
          timestamp: Date.now()
        })
      )

      const transaction = await this.academicContract.methods
        .recordQuizSubmission(
          this.currentAccount,
          quizHash,
          answerHash,
          Math.floor(score),
          totalQuestions,
          subjectCode
        )
        .send({
          from: this.currentAccount,
          gas: 500000
        })

      return {
        success: true,
        transactionHash: transaction.transactionHash,
        quizHash,
        answerHash
      }
    } catch (error) {
      console.error('Blockchain quiz recording failed:', error)
      throw new Error('Failed to record quiz on blockchain: ' + error.message)
    }
  }

  /**
   * Record schedule completion on blockchain
   */
  async recordScheduleCompletionOnBlockchain(scheduleData) {
    if (!this.academicContract || !this.currentAccount) {
      throw new Error('Academic contract not initialized or wallet not connected')
    }

    try {
      const { scheduleId, creditsEarned, scheduleTitle } = scheduleData

      // Create hash of schedule ID
      const scheduleHash = this.web3.utils.sha3(scheduleId.toString())

      const transaction = await this.academicContract.methods
        .recordScheduleCompletion(
          this.currentAccount,
          scheduleHash,
          creditsEarned,
          scheduleTitle
        )
        .send({
          from: this.currentAccount,
          gas: 400000
        })

      return {
        success: true,
        transactionHash: transaction.transactionHash,
        scheduleHash
      }
    } catch (error) {
      console.error('Blockchain schedule recording failed:', error)
      throw new Error('Failed to record schedule completion: ' + error.message)
    }
  }

  /**
   * Get student's quiz records from blockchain
   */
  async getStudentQuizRecords(studentAddress = null) {
    if (!this.academicContract) {
      throw new Error('Academic contract not initialized')
    }

    try {
      const address = studentAddress || this.currentAccount
      const records = await this.academicContract.methods
        .getStudentQuizRecords(address)
        .call()

      return records.map(record => ({
        quizHash: record.quizHash,
        answerHash: record.answerHash,
        score: parseInt(record.score),
        totalQuestions: parseInt(record.totalQuestions),
        timestamp: parseInt(record.timestamp) * 1000,
        subjectCode: record.subjectCode,
        verified: record.verified
      }))
    } catch (error) {
      console.error('Failed to get quiz records:', error)
      return []
    }
  }

  /**
   * Get student's schedule completions from blockchain
   */
  async getStudentScheduleCompletions(studentAddress = null) {
    if (!this.academicContract) {
      throw new Error('Academic contract not initialized')
    }

    try {
      const address = studentAddress || this.currentAccount
      const completions = await this.academicContract.methods
        .getStudentScheduleCompletions(address)
        .call()

      return completions.map(completion => ({
        scheduleId: completion.scheduleId,
        creditsEarned: parseInt(completion.creditsEarned),
        completionDate: parseInt(completion.completionDate) * 1000,
        scheduleTitle: completion.scheduleTitle,
        verified: completion.verified
      }))
    } catch (error) {
      console.error('Failed to get schedule completions:', error)
      return []
    }
  }

  /**
   * Get student's blockchain credit balance
   */
  async getStudentBlockchainCredits(studentAddress = null) {
    if (!this.academicContract) {
      throw new Error('Academic contract not initialized')
    }

    try {
      const address = studentAddress || this.currentAccount
      const credits = await this.academicContract.methods
        .getStudentCredits(address)
        .call()

      return {
        totalCredits: parseInt(credits.totalCredits),
        completedSchedules: parseInt(credits.completedSchedules),
        quizzesTaken: parseInt(credits.quizzesTaken),
        lastUpdated: parseInt(credits.lastUpdated) * 1000
      }
    } catch (error) {
      console.error('Failed to get blockchain credits:', error)
      return null
    }
  }

  /**
   * Verify if a quiz was submitted on blockchain
   */
  async verifyQuizSubmission(quizHash, studentAddress = null) {
    if (!this.academicContract) {
      return false
    }

    try {
      const address = studentAddress || this.currentAccount
      return await this.academicContract.methods
        .verifyQuizSubmission(address, quizHash)
        .call()
    } catch (error) {
      console.error('Quiz verification failed:', error)
      return false
    }
  }

  /**
   * Verify if a schedule was completed on blockchain
   */
  async verifyScheduleCompletion(scheduleId, studentAddress = null) {
    if (!this.academicContract) {
      return false
    }

    try {
      const address = studentAddress || this.currentAccount
      const scheduleHash = this.web3.utils.sha3(scheduleId.toString())
      return await this.academicContract.methods
        .verifyScheduleCompletion(address, scheduleHash)
        .call()
    } catch (error) {
      console.error('Schedule verification failed:', error)
      return false
    }
  }

  /**
   * Get blockchain stats for student dashboard
   */
  async getStudentBlockchainStats(studentAddress = null) {
    if (!this.academicContract) {
      return null
    }

    try {
      const address = studentAddress || this.currentAccount
      const [credits, quizCount, scheduleCount] = await Promise.all([
        this.getStudentBlockchainCredits(address),
        this.academicContract.methods.getQuizCount(address).call(),
        this.academicContract.methods.getScheduleCompletionCount(address).call()
      ])

      return {
        ...credits,
        quizCount: parseInt(quizCount),
        scheduleCount: parseInt(scheduleCount)
      }
    } catch (error) {
      console.error('Failed to get blockchain stats:', error)
      return null
    }
  }
}

export default new BlockchainService()