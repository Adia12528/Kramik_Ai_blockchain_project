// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title KramikAcademicRecords
 * @dev Smart contract for storing immutable academic records including quizzes, schedules, and credits
 * @author Kramik Engineering Hub
 */
contract KramikAcademicRecords {
    
    // Structs
    struct QuizRecord {
        bytes32 quizHash;           // Hash of quiz questions
        bytes32 answerHash;         // Hash of student answers
        uint8 score;                // Score out of 100
        uint8 totalQuestions;       // Total questions answered
        uint256 timestamp;          // Submission timestamp
        string subjectCode;         // Subject identifier
        bool verified;              // Verification status
    }
    
    struct ScheduleCompletion {
        bytes32 scheduleId;         // Hash of schedule entry ID
        uint256 creditsEarned;      // Credits awarded
        uint256 completionDate;     // Completion timestamp
        string scheduleTitle;       // Schedule entry title
        bool verified;              // Verification status
    }
    
    struct StudentCredits {
        uint256 totalCredits;       // Total credits earned
        uint256 completedSchedules; // Number of completed schedules
        uint256 quizzesTaken;       // Total quizzes taken
        uint256 lastUpdated;        // Last update timestamp
    }
    
    // Mappings
    mapping(address => QuizRecord[]) public studentQuizRecords;
    mapping(address => ScheduleCompletion[]) public studentScheduleCompletions;
    mapping(address => StudentCredits) public studentCreditsBalance;
    mapping(address => mapping(bytes32 => bool)) public quizSubmitted; // Prevent duplicate submissions
    mapping(address => mapping(bytes32 => bool)) public scheduleCompleted; // Track schedule completions
    
    // Administrative
    address public owner;
    mapping(address => bool) public authorizedAdmins;
    bool public contractActive;
    
    // Events
    event QuizRecorded(
        address indexed student,
        bytes32 indexed quizHash,
        uint8 score,
        string subjectCode,
        uint256 timestamp
    );
    
    event ScheduleCompleted(
        address indexed student,
        bytes32 indexed scheduleId,
        uint256 creditsEarned,
        string scheduleTitle,
        uint256 timestamp
    );
    
    event CreditsUpdated(
        address indexed student,
        uint256 newTotalCredits,
        uint256 timestamp
    );
    
    event AdminAuthorized(address indexed admin, uint256 timestamp);
    event AdminRevoked(address indexed admin, uint256 timestamp);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorized() {
        require(
            msg.sender == owner || authorizedAdmins[msg.sender],
            "Not authorized"
        );
        _;
    }
    
    modifier contractIsActive() {
        require(contractActive, "Contract is not active");
        _;
    }
    
    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        contractActive = true;
        authorizedAdmins[msg.sender] = true;
    }
    
    /**
     * @dev Record a quiz submission on blockchain
     * @param _student Student's wallet address
     * @param _quizHash Hash of quiz questions
     * @param _answerHash Hash of student's answers
     * @param _score Score achieved (0-100)
     * @param _totalQuestions Number of questions answered
     * @param _subjectCode Subject identifier
     */
    function recordQuizSubmission(
        address _student,
        bytes32 _quizHash,
        bytes32 _answerHash,
        uint8 _score,
        uint8 _totalQuestions,
        string memory _subjectCode
    ) external contractIsActive validAddress(_student) {
        require(_score <= 100, "Invalid score");
        require(_totalQuestions > 0, "Must have questions");
        require(!quizSubmitted[_student][_quizHash], "Quiz already submitted");
        
        QuizRecord memory newQuiz = QuizRecord({
            quizHash: _quizHash,
            answerHash: _answerHash,
            score: _score,
            totalQuestions: _totalQuestions,
            timestamp: block.timestamp,
            subjectCode: _subjectCode,
            verified: true
        });
        
        studentQuizRecords[_student].push(newQuiz);
        quizSubmitted[_student][_quizHash] = true;
        
        // Update student stats
        studentCreditsBalance[_student].quizzesTaken++;
        studentCreditsBalance[_student].lastUpdated = block.timestamp;
        
        emit QuizRecorded(_student, _quizHash, _score, _subjectCode, block.timestamp);
    }
    
    /**
     * @dev Record schedule completion and award credits
     * @param _student Student's wallet address
     * @param _scheduleId Hash of schedule entry ID
     * @param _creditsEarned Credits awarded for completion
     * @param _scheduleTitle Title of the schedule entry
     */
    function recordScheduleCompletion(
        address _student,
        bytes32 _scheduleId,
        uint256 _creditsEarned,
        string memory _scheduleTitle
    ) external contractIsActive validAddress(_student) {
        require(_creditsEarned > 0, "Must award credits");
        require(!scheduleCompleted[_student][_scheduleId], "Schedule already completed");
        
        ScheduleCompletion memory completion = ScheduleCompletion({
            scheduleId: _scheduleId,
            creditsEarned: _creditsEarned,
            completionDate: block.timestamp,
            scheduleTitle: _scheduleTitle,
            verified: true
        });
        
        studentScheduleCompletions[_student].push(completion);
        scheduleCompleted[_student][_scheduleId] = true;
        
        // Update credits
        studentCreditsBalance[_student].totalCredits += _creditsEarned;
        studentCreditsBalance[_student].completedSchedules++;
        studentCreditsBalance[_student].lastUpdated = block.timestamp;
        
        emit ScheduleCompleted(_student, _scheduleId, _creditsEarned, _scheduleTitle, block.timestamp);
        emit CreditsUpdated(_student, studentCreditsBalance[_student].totalCredits, block.timestamp);
    }
    
    /**
     * @dev Get all quiz records for a student
     * @param _student Student's wallet address
     * @return Array of quiz records
     */
    function getStudentQuizRecords(address _student) 
        external 
        view 
        returns (QuizRecord[] memory) 
    {
        return studentQuizRecords[_student];
    }
    
    /**
     * @dev Get all schedule completions for a student
     * @param _student Student's wallet address
     * @return Array of schedule completions
     */
    function getStudentScheduleCompletions(address _student) 
        external 
        view 
        returns (ScheduleCompletion[] memory) 
    {
        return studentScheduleCompletions[_student];
    }
    
    /**
     * @dev Get student's credit balance and stats
     * @param _student Student's wallet address
     * @return StudentCredits struct
     */
    function getStudentCredits(address _student) 
        external 
        view 
        returns (StudentCredits memory) 
    {
        return studentCreditsBalance[_student];
    }
    
    /**
     * @dev Verify if a quiz was submitted
     * @param _student Student's wallet address
     * @param _quizHash Hash of the quiz
     * @return bool verification status
     */
    function verifyQuizSubmission(address _student, bytes32 _quizHash) 
        external 
        view 
        returns (bool) 
    {
        return quizSubmitted[_student][_quizHash];
    }
    
    /**
     * @dev Verify if a schedule was completed
     * @param _student Student's wallet address
     * @param _scheduleId Hash of schedule ID
     * @return bool completion status
     */
    function verifyScheduleCompletion(address _student, bytes32 _scheduleId) 
        external 
        view 
        returns (bool) 
    {
        return scheduleCompleted[_student][_scheduleId];
    }
    
    /**
     * @dev Get quiz count for a student
     * @param _student Student's wallet address
     * @return Number of quizzes taken
     */
    function getQuizCount(address _student) external view returns (uint256) {
        return studentQuizRecords[_student].length;
    }
    
    /**
     * @dev Get schedule completion count for a student
     * @param _student Student's wallet address
     * @return Number of schedules completed
     */
    function getScheduleCompletionCount(address _student) external view returns (uint256) {
        return studentScheduleCompletions[_student].length;
    }
    
    /**
     * @dev Authorize an admin to record academic data
     * @param _admin Admin's wallet address
     */
    function authorizeAdmin(address _admin) 
        external 
        onlyOwner 
        validAddress(_admin) 
    {
        authorizedAdmins[_admin] = true;
        emit AdminAuthorized(_admin, block.timestamp);
    }
    
    /**
     * @dev Revoke admin authorization
     * @param _admin Admin's wallet address
     */
    function revokeAdmin(address _admin) 
        external 
        onlyOwner 
        validAddress(_admin) 
    {
        authorizedAdmins[_admin] = false;
        emit AdminRevoked(_admin, block.timestamp);
    }
    
    /**
     * @dev Toggle contract active state
     */
    function toggleContractState() external onlyOwner {
        contractActive = !contractActive;
    }
    
    /**
     * @dev Transfer ownership
     * @param _newOwner New owner's address
     */
    function transferOwnership(address _newOwner) 
        external 
        onlyOwner 
        validAddress(_newOwner) 
    {
        owner = _newOwner;
    }
}
