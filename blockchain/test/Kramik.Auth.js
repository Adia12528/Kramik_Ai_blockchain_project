const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("KramikAuth", function () {
  let KramikAuth
  let kramikAuth
  let owner
  let student
  let admin
  let other

  beforeEach(async function () {
    [owner, student, admin, other] = await ethers.getSigners()
    
    KramikAuth = await ethers.getContractFactory("KramikAuth")
    kramikAuth = await KramikAuth.deploy()
    await kramikAuth.deployed()
  })

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await kramikAuth.owner()).to.equal(owner.address)
    })

    it("Should be active by default", async function () {
      expect(await kramikAuth.contractActive()).to.equal(true)
    })

    it("Should have zero students and admins initially", async function () {
      expect(await kramikAuth.studentCount()).to.equal(0)
      expect(await kramikAuth.adminCount()).to.equal(0)
    })
  })

  describe("Student Registration", function () {
    const studentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("student data"))

    it("Should register a new student", async function () {
      await kramikAuth.registerStudent(studentHash, student.address)
      
      const record = await kramikAuth.getStudentRecord(student.address)
      expect(record.walletAddress).to.equal(student.address)
      expect(record.studentHash).to.equal(studentHash)
      expect(record.isActive).to.equal(true)
    })

    it("Should increment student count", async function () {
      await kramikAuth.registerStudent(studentHash, student.address)
      expect(await kramikAuth.studentCount()).to.equal(1)
    })

    it("Should emit StudentRegistered event", async function () {
      await expect(kramikAuth.registerStudent(studentHash, student.address))
        .to.emit(kramikAuth, "StudentRegistered")
        .withArgs(student.address, studentHash, await ethers.provider.getBlockNumber())
    })

    it("Should not allow duplicate student registration", async function () {
      await kramikAuth.registerStudent(studentHash, student.address)
      
      await expect(
        kramikAuth.registerStudent(studentHash, student.address)
      ).to.be.revertedWith("KramikAuth: Student already registered")
    })

    it("Should not allow zero address registration", async function () {
      await expect(
        kramikAuth.registerStudent(studentHash, ethers.constants.AddressZero)
      ).to.be.revertedWith("KramikAuth: Invalid address")
    })
  })

  describe("Admin Registration", function () {
    it("Should register a new admin", async function () {
      await kramikAuth.registerAdmin(admin.address, "Content Manager")
      
      const record = await kramikAuth.getAdminRecord(admin.address)
      expect(record.walletAddress).to.equal(admin.address)
      expect(record.role).to.equal("Content Manager")
      expect(record.isActive).to.equal(true)
    })

    it("Should increment admin count", async function () {
      await kramikAuth.registerAdmin(admin.address, "Content Manager")
      expect(await kramikAuth.adminCount()).to.equal(1)
    })

    it("Should emit AdminRegistered event", async function () {
      await expect(kramikAuth.registerAdmin(admin.address, "Content Manager"))
        .to.emit(kramikAuth, "AdminRegistered")
        .withArgs(admin.address, "Content Manager", await ethers.provider.getBlockNumber())
    })
  })

  describe("Verification", function () {
    const studentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("student data"))

    beforeEach(async function () {
      await kramikAuth.registerStudent(studentHash, student.address)
      await kramikAuth.registerAdmin(admin.address, "Content Manager")
    })

    it("Should verify registered student", async function () {
      expect(await kramikAuth.verifyStudent(student.address)).to.equal(true)
    })

    it("Should verify registered admin", async function () {
      expect(await kramikAuth.verifyAdmin(admin.address)).to.equal(true)
    })

    it("Should not verify unregistered address", async function () {
      expect(await kramikAuth.verifyStudent(other.address)).to.equal(false)
      expect(await kramikAuth.verifyAdmin(other.address)).to.equal(false)
    })
  })

  describe("Access Control", function () {
    it("Should not allow non-owner to register students", async function () {
      const studentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("student data"))
      
      await expect(
        kramikAuth.connect(student).registerStudent(studentHash, student.address)
      ).to.be.revertedWith("KramikAuth: Only owner can perform this action")
    })

    it("Should not allow non-owner to register admins", async function () {
      await expect(
        kramikAuth.connect(student).registerAdmin(admin.address, "Content Manager")
      ).to.be.revertedWith("KramikAuth: Only owner can perform this action")
    })
  })

  describe("Status Management", function () {
    const studentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("student data"))

    beforeEach(async function () {
      await kramikAuth.registerStudent(studentHash, student.address)
      await kramikAuth.registerAdmin(admin.address, "Content Manager")
    })

    it("Should deactivate student", async function () {
      await kramikAuth.setStudentStatus(student.address, false)
      expect(await kramikAuth.verifyStudent(student.address)).to.equal(false)
    })

    it("Should deactivate admin", async function () {
      await kramikAuth.setAdminStatus(admin.address, false)
      expect(await kramikAuth.verifyAdmin(admin.address)).to.equal(false)
    })

    it("Should reactivate student", async function () {
      await kramikAuth.setStudentStatus(student.address, false)
      await kramikAuth.setStudentStatus(student.address, true)
      expect(await kramikAuth.verifyStudent(student.address)).to.equal(true)
    })
  })
})