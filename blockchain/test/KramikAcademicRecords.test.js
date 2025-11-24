const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KramikAcademicRecords", function () {
  let academicRecords;
  let owner;
  let student1;
  let student2;

  beforeEach(async function () {
    [owner, student1, student2] = await ethers.getSigners();
    
    const KramikAcademicRecords = await ethers.getContractFactory("KramikAcademicRecords");
    academicRecords = await KramikAcademicRecords.deploy();
    await academicRecords.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await academicRecords.owner()).to.equal(owner.address);
    });

    it("Should initialize contract as active", async function () {
      expect(await academicRecords.contractActive()).to.equal(true);
    });

    it("Should authorize owner as admin", async function () {
      expect(await academicRecords.authorizedAdmins(owner.address)).to.equal(true);
    });
  });

  describe("Quiz Recording", function () {
    it("Should record quiz submission", async function () {
      const quizHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("quiz1"));
      const answerHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("answers1"));
      
      await academicRecords.recordQuizSubmission(
        student1.address,
        quizHash,
        answerHash,
        85,
        10,
        "DSA"
      );

      const quizCount = await academicRecords.getQuizCount(student1.address);
      expect(quizCount).to.equal(1);
    });

    it("Should prevent duplicate quiz submissions", async function () {
      const quizHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("quiz1"));
      const answerHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("answers1"));
      
      await academicRecords.recordQuizSubmission(
        student1.address,
        quizHash,
        answerHash,
        85,
        10,
        "DSA"
      );

      await expect(
        academicRecords.recordQuizSubmission(
          student1.address,
          quizHash,
          answerHash,
          90,
          10,
          "DSA"
        )
      ).to.be.revertedWith("Quiz already submitted");
    });

    it("Should update student quiz count", async function () {
      const quizHash1 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("quiz1"));
      const quizHash2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("quiz2"));
      const answerHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("answers"));
      
      await academicRecords.recordQuizSubmission(student1.address, quizHash1, answerHash, 85, 10, "DSA");
      await academicRecords.recordQuizSubmission(student1.address, quizHash2, answerHash, 90, 10, "DBMS");

      const credits = await academicRecords.getStudentCredits(student1.address);
      expect(credits.quizzesTaken).to.equal(2);
    });

    it("Should emit QuizRecorded event", async function () {
      const quizHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("quiz1"));
      const answerHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("answers1"));
      
      await expect(
        academicRecords.recordQuizSubmission(student1.address, quizHash, answerHash, 85, 10, "DSA")
      ).to.emit(academicRecords, "QuizRecorded")
        .withArgs(student1.address, quizHash, 85, "DSA", await ethers.provider.getBlockNumber() + 1);
    });
  });

  describe("Schedule Completion", function () {
    it("Should record schedule completion", async function () {
      const scheduleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("schedule1"));
      
      await academicRecords.recordScheduleCompletion(
        student1.address,
        scheduleHash,
        5,
        "Data Structures Lab"
      );

      const scheduleCount = await academicRecords.getScheduleCompletionCount(student1.address);
      expect(scheduleCount).to.equal(1);
    });

    it("Should award credits correctly", async function () {
      const scheduleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("schedule1"));
      
      await academicRecords.recordScheduleCompletion(student1.address, scheduleHash, 5, "DSA Lab");

      const credits = await academicRecords.getStudentCredits(student1.address);
      expect(credits.totalCredits).to.equal(5);
    });

    it("Should prevent duplicate schedule completions", async function () {
      const scheduleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("schedule1"));
      
      await academicRecords.recordScheduleCompletion(student1.address, scheduleHash, 5, "DSA Lab");

      await expect(
        academicRecords.recordScheduleCompletion(student1.address, scheduleHash, 5, "DSA Lab")
      ).to.be.revertedWith("Schedule already completed");
    });

    it("Should accumulate credits from multiple completions", async function () {
      const schedule1 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("schedule1"));
      const schedule2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("schedule2"));
      
      await academicRecords.recordScheduleCompletion(student1.address, schedule1, 5, "DSA Lab");
      await academicRecords.recordScheduleCompletion(student1.address, schedule2, 3, "DBMS Tutorial");

      const credits = await academicRecords.getStudentCredits(student1.address);
      expect(credits.totalCredits).to.equal(8);
      expect(credits.completedSchedules).to.equal(2);
    });

    it("Should emit ScheduleCompleted and CreditsUpdated events", async function () {
      const scheduleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("schedule1"));
      
      await expect(
        academicRecords.recordScheduleCompletion(student1.address, scheduleHash, 5, "DSA Lab")
      ).to.emit(academicRecords, "ScheduleCompleted")
        .and.to.emit(academicRecords, "CreditsUpdated");
    });
  });

  describe("Verification", function () {
    it("Should verify quiz submission", async function () {
      const quizHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("quiz1"));
      const answerHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("answers1"));
      
      await academicRecords.recordQuizSubmission(student1.address, quizHash, answerHash, 85, 10, "DSA");

      const isVerified = await academicRecords.verifyQuizSubmission(student1.address, quizHash);
      expect(isVerified).to.equal(true);
    });

    it("Should verify schedule completion", async function () {
      const scheduleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("schedule1"));
      
      await academicRecords.recordScheduleCompletion(student1.address, scheduleHash, 5, "DSA Lab");

      const isVerified = await academicRecords.verifyScheduleCompletion(student1.address, scheduleHash);
      expect(isVerified).to.equal(true);
    });
  });

  describe("Retrieval", function () {
    it("Should retrieve all quiz records for a student", async function () {
      const quiz1 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("quiz1"));
      const quiz2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("quiz2"));
      const answerHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("answers"));
      
      await academicRecords.recordQuizSubmission(student1.address, quiz1, answerHash, 85, 10, "DSA");
      await academicRecords.recordQuizSubmission(student1.address, quiz2, answerHash, 90, 10, "DBMS");

      const records = await academicRecords.getStudentQuizRecords(student1.address);
      expect(records.length).to.equal(2);
      expect(records[0].score).to.equal(85);
      expect(records[1].score).to.equal(90);
    });

    it("Should retrieve all schedule completions for a student", async function () {
      const schedule1 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("schedule1"));
      const schedule2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("schedule2"));
      
      await academicRecords.recordScheduleCompletion(student1.address, schedule1, 5, "DSA Lab");
      await academicRecords.recordScheduleCompletion(student1.address, schedule2, 3, "DBMS Tutorial");

      const completions = await academicRecords.getStudentScheduleCompletions(student1.address);
      expect(completions.length).to.equal(2);
      expect(completions[0].creditsEarned).to.equal(5);
      expect(completions[1].creditsEarned).to.equal(3);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to authorize admin", async function () {
      await academicRecords.authorizeAdmin(student1.address);
      expect(await academicRecords.authorizedAdmins(student1.address)).to.equal(true);
    });

    it("Should prevent non-owner from authorizing admin", async function () {
      await expect(
        academicRecords.connect(student1).authorizeAdmin(student2.address)
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should allow owner to toggle contract state", async function () {
      await academicRecords.toggleContractState();
      expect(await academicRecords.contractActive()).to.equal(false);
      
      await academicRecords.toggleContractState();
      expect(await academicRecords.contractActive()).to.equal(true);
    });
  });
});
