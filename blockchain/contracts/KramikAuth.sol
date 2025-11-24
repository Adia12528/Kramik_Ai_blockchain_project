// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title KramikAuth
 * @dev Smart contract for student and admin authentication with blockchain verification
 * @author Kramik Engineering Hub
 */
contract KramikAuth {
    struct StudentRecord {
        bytes32 studentHash;
        address walletAddress;
        uint256 registrationDate;
        bool isActive;
        uint256 lastLogin;
    }
    
    struct AdminRecord {
        address walletAddress;
        uint256 registrationDate;
        string role;
        bool isActive;
        uint256 lastLogin;
    }
    
    // Mappings for user records
    mapping(address => StudentRecord) public studentRecords;
    mapping(address => AdminRecord) public adminRecords;
    
    // Administrative state
    address public owner;
    uint256 public studentCount;
    uint256 public adminCount;
    bool public contractActive;
    
    // Events
    event StudentRegistered(
        address indexed studentAddress, 
        bytes32 studentHash, 
        uint256 timestamp
    );
    event AdminRegistered(
        address indexed adminAddress, 
        string role, 
        uint256 timestamp
    );
    event StudentStatusChanged(
        address indexed studentAddress, 
        bool isActive, 
        uint256 timestamp
    );
    event AdminStatusChanged(
        address indexed adminAddress, 
        bool isActive, 
        uint256 timestamp
    );
    event StudentLoggedIn(
        address indexed studentAddress,
        uint256 timestamp
    );
    event AdminLoggedIn(
        address indexed adminAddress,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "KramikAuth: Only owner can perform this action");
        _;
    }
    
    modifier contractIsActive() {
        require(contractActive, "KramikAuth: Contract is not active");
        _;
    }
    
    modifier validAddress(address _address) {
        require(_address != address(0), "KramikAuth: Invalid address");
        _;
    }
    
    /**
     * @dev Constructor sets the contract owner and activates the contract
     */
    constructor() {
        owner = msg.sender;
        contractActive = true;
        studentCount = 0;
        adminCount = 0;
    }
    
    /**
     * @dev Register a new student with their data hash
     * @param _studentHash Hash of student data for verification
     * @param _studentAddress Student's wallet address
     */
    function registerStudent(
        bytes32 _studentHash, 
        address _studentAddress
    ) external onlyOwner contractIsActive validAddress(_studentAddress) {
        require(_studentHash != bytes32(0), "KramikAuth: Invalid student hash");
        require(
            studentRecords[_studentAddress].walletAddress == address(0), 
            "KramikAuth: Student already registered"
        );
        
        studentRecords[_studentAddress] = StudentRecord({
            studentHash: _studentHash,
            walletAddress: _studentAddress,
            registrationDate: block.timestamp,
            isActive: true,
            lastLogin: 0
        });
        
        studentCount++;
        emit StudentRegistered(_studentAddress, _studentHash, block.timestamp);
    }
    
    /**
     * @dev Register a new admin with specific role
     * @param _adminAddress Admin's wallet address
     * @param _role Admin role description
     */
    function registerAdmin(
        address _adminAddress, 
        string memory _role
    ) external onlyOwner contractIsActive validAddress(_adminAddress) {
        require(bytes(_role).length > 0, "KramikAuth: Role cannot be empty");
        require(
            adminRecords[_adminAddress].walletAddress == address(0), 
            "KramikAuth: Admin already registered"
        );
        
        adminRecords[_adminAddress] = AdminRecord({
            walletAddress: _adminAddress,
            registrationDate: block.timestamp,
            role: _role,
            isActive: true,
            lastLogin: 0
        });
        
        adminCount++;
        emit AdminRegistered(_adminAddress, _role, block.timestamp);
    }
    
    /**
     * @dev Verify if a student is registered and active
     * @param _studentAddress Student's wallet address to verify
     * @return bool True if student is verified
     */
    function verifyStudent(
        address _studentAddress
    ) external view validAddress(_studentAddress) returns (bool) {
        StudentRecord memory record = studentRecords[_studentAddress];
        return record.isActive && record.walletAddress != address(0);
    }
    
    /**
     * @dev Verify if an admin is registered and active
     * @param _adminAddress Admin's wallet address to verify
     * @return bool True if admin is verified
     */
    function verifyAdmin(
        address _adminAddress
    ) external view validAddress(_adminAddress) returns (bool) {
        AdminRecord memory record = adminRecords[_adminAddress];
        return record.isActive && record.walletAddress != address(0);
    }
    
    /**
     * @dev Get complete student record
     * @param _studentAddress Student's wallet address
     * @return studentHash Hash of student data
     * @return walletAddress Student's wallet address
     * @return registrationDate Registration timestamp
     * @return isActive Active status
     * @return lastLogin Last login timestamp
     */
    function getStudentRecord(
        address _studentAddress
    ) external view validAddress(_studentAddress) returns (
        bytes32 studentHash,
        address walletAddress,
        uint256 registrationDate,
        bool isActive,
        uint256 lastLogin
    ) {
        StudentRecord memory record = studentRecords[_studentAddress];
        require(record.walletAddress != address(0), "KramikAuth: Student not found");
        
        return (
            record.studentHash,
            record.walletAddress,
            record.registrationDate,
            record.isActive,
            record.lastLogin
        );
    }
    
    /**
     * @dev Get complete admin record
     * @param _adminAddress Admin's wallet address
     * @return walletAddress Admin's wallet address
     * @return registrationDate Registration timestamp
     * @return role Admin role
     * @return isActive Active status
     * @return lastLogin Last login timestamp
     */
    function getAdminRecord(
        address _adminAddress
    ) external view validAddress(_adminAddress) returns (
        address walletAddress,
        uint256 registrationDate,
        string memory role,
        bool isActive,
        uint256 lastLogin
    ) {
        AdminRecord memory record = adminRecords[_adminAddress];
        require(record.walletAddress != address(0), "KramikAuth: Admin not found");
        
        return (
            record.walletAddress,
            record.registrationDate,
            record.role,
            record.isActive,
            record.lastLogin
        );
    }
    
    /**
     * @dev Update student login timestamp
     * @param _studentAddress Student's wallet address
     */
    function updateStudentLogin(
        address _studentAddress
    ) external onlyOwner validAddress(_studentAddress) {
        require(
            studentRecords[_studentAddress].walletAddress != address(0), 
            "KramikAuth: Student not found"
        );
        require(
            studentRecords[_studentAddress].isActive, 
            "KramikAuth: Student is not active"
        );
        
        studentRecords[_studentAddress].lastLogin = block.timestamp;
        emit StudentLoggedIn(_studentAddress, block.timestamp);
    }
    
    /**
     * @dev Update admin login timestamp
     * @param _adminAddress Admin's wallet address
     */
    function updateAdminLogin(
        address _adminAddress
    ) external onlyOwner validAddress(_adminAddress) {
        require(
            adminRecords[_adminAddress].walletAddress != address(0), 
            "KramikAuth: Admin not found"
        );
        require(
            adminRecords[_adminAddress].isActive, 
            "KramikAuth: Admin is not active"
        );
        
        adminRecords[_adminAddress].lastLogin = block.timestamp;
        emit AdminLoggedIn(_adminAddress, block.timestamp);
    }
    
    /**
     * @dev Activate/deactivate a student
     * @param _studentAddress Student's wallet address
     * @param _isActive New active status
     */
    function setStudentStatus(
        address _studentAddress, 
        bool _isActive
    ) external onlyOwner validAddress(_studentAddress) {
        require(
            studentRecords[_studentAddress].walletAddress != address(0), 
            "KramikAuth: Student not found"
        );
        
        studentRecords[_studentAddress].isActive = _isActive;
        emit StudentStatusChanged(_studentAddress, _isActive, block.timestamp);
    }
    
    /**
     * @dev Activate/deactivate an admin
     * @param _adminAddress Admin's wallet address
     * @param _isActive New active status
     */
    function setAdminStatus(
        address _adminAddress, 
        bool _isActive
    ) external onlyOwner validAddress(_adminAddress) {
        require(
            adminRecords[_adminAddress].walletAddress != address(0), 
            "KramikAuth: Admin not found"
        );
        
        adminRecords[_adminAddress].isActive = _isActive;
        emit AdminStatusChanged(_adminAddress, _isActive, block.timestamp);
    }
    
    /**
     * @dev Get contract statistics
     * @return totalStudents Number of registered students
     * @return totalAdmins Number of registered admins
     * @return contractOwner Current contract owner
     * @return isActive Contract active status
     */
    function getContractStats() external view returns (
        uint256 totalStudents,
        uint256 totalAdmins,
        address contractOwner,
        bool isActive
    ) {
        return (
            studentCount,
            adminCount,
            owner,
            contractActive
        );
    }
    
    /**
     * @dev Emergency stop mechanism
     * @param _active New contract active status
     */
    function setContractActive(bool _active) external onlyOwner {
        contractActive = _active;
    }
    
    /**
     * @dev Check if address is registered as any user type
     * @param _address Address to check
     * @return isStudent True if registered as student
     * @return isAdmin True if registered as admin
     */
    function checkRegistration(
        address _address
    ) external view validAddress(_address) returns (
        bool isStudent,
        bool isAdmin
    ) {
        StudentRecord memory student = studentRecords[_address];
        AdminRecord memory admin = adminRecords[_address];
        
        return (
            student.walletAddress != address(0) && student.isActive,
            admin.walletAddress != address(0) && admin.isActive
        );
    }
}