// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Digital Evidence Preservation Contract (Phase 4 - Role-Based Access)
 * @dev Stores evidence metadata on-chain with Officer/Judge/Admin roles.
 */
contract Evidence {
    
    // Struct to hold evidence details
    struct EvidenceRecord {
        uint256 id;
        string caseId;
        string fileHash;    // Digital Fingerprint (SHA-256)
        string fileName;
        address uploader;   // Address of the officer who uploaded
        uint256 timestamp;  // Block timestamp of upload
        bool isApproved;    // Judge approval status
        address approvedBy; // Judge who approved
        uint256 approvedAt; // Approval timestamp
    }

    // Array to store all evidence IDs (for counting)
    uint256 private _evidenceIds;

    // Global array of all evidence (for "Load All" feature)
    EvidenceRecord[] public allEvidence;

    // Mappings
    mapping(string => EvidenceRecord[]) private evidenceByCase; // caseId => Evidence List
    mapping(string => bool) public fileHashExists;             // fast existence check
    mapping(string => uint256) private hashToIndex;            // fileHash => index in allEvidence

    // Role Mappings
    mapping(address => bool) public authorizedOfficers;
    mapping(address => bool) public authorizedJudges;

    // Events
    event EvidenceUploaded(string indexed caseId, string fileHash, string fileName, address indexed uploader, uint256 timestamp);
    event EvidenceApproved(string indexed fileHash, address indexed judge, uint256 timestamp);
    event OfficerAdded(address indexed officer, address indexed addedBy);
    event JudgeAdded(address indexed judge, address indexed addedBy);

    address public owner;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can perform this action");
        _;
    }

    modifier onlyOfficer() {
        require(authorizedOfficers[msg.sender], "Not an authorized officer");
        _;
    }

    modifier onlyJudge() {
        require(authorizedJudges[msg.sender], "Not an authorized judge");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Deployer is the first authorized officer (Admin has officer rights too)
        authorizedOfficers[msg.sender] = true;
    }

    /**
     * @dev Uploads evidence metadata to the blockchain. Officers only.
     */
    function uploadEvidence(string memory _caseId, string memory _fileHash, string memory _fileName) public onlyOfficer {
        // Input validation
        require(bytes(_caseId).length > 0, "Case ID is required");
        require(bytes(_fileHash).length == 64, "Invalid SHA-256 hash (must be 64 characters)");
        require(bytes(_fileName).length > 0, "File name is required");
        require(!fileHashExists[_fileHash], "Evidence integrity check failed: Duplicate Hash");

        _evidenceIds++;
        uint256 newId = _evidenceIds;

        EvidenceRecord memory newEvidence = EvidenceRecord({
            id: newId,
            caseId: _caseId,
            fileHash: _fileHash,
            fileName: _fileName,
            uploader: msg.sender,
            timestamp: block.timestamp,
            isApproved: false,
            approvedBy: address(0),
            approvedAt: 0
        });

        // Store in mappings and global array
        evidenceByCase[_caseId].push(newEvidence);
        allEvidence.push(newEvidence);
        hashToIndex[_fileHash] = allEvidence.length - 1;
        fileHashExists[_fileHash] = true;

        emit EvidenceUploaded(_caseId, _fileHash, _fileName, msg.sender, block.timestamp);
    }

    /**
     * @dev Approves evidence for court admissibility. Judges only.
     */
    function approveEvidence(string memory _fileHash) public onlyJudge {
        require(fileHashExists[_fileHash], "Evidence not found");
        
        uint256 index = hashToIndex[_fileHash];
        require(!allEvidence[index].isApproved, "Evidence already approved");

        allEvidence[index].isApproved = true;
        allEvidence[index].approvedBy = msg.sender;
        allEvidence[index].approvedAt = block.timestamp;

        emit EvidenceApproved(_fileHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Returns all evidence for a specific case.
     */
    function getEvidenceByCase(string memory _caseId) public view returns (EvidenceRecord[] memory) {
        return evidenceByCase[_caseId];
    }

    /**
     * @dev Returns ALL evidence recorded on the blockchain.
     */
    function getAllEvidence() public view returns (EvidenceRecord[] memory) {
        return allEvidence;
    }
    
    /**
     * @dev Verifies if a file hash exists on-chain.
     */
    function verifyIntegrity(string memory _fileHash) public view returns (bool) {
        return fileHashExists[_fileHash];
    }

    /**
     * @dev Get the role of a given address.
     * @return "admin", "judge", "officer", or "none"
     */
    function getRole(address _addr) public view returns (string memory) {
        if (_addr == owner) {
            return "admin";
        } else if (authorizedJudges[_addr]) {
            return "judge";
        } else if (authorizedOfficers[_addr]) {
            return "officer";
        } else {
            return "none";
        }
    }

    /**
     * @dev Adds a new officer. Only admin can add.
     */
    function addOfficer(address _officer) public onlyOwner {
        authorizedOfficers[_officer] = true;
        emit OfficerAdded(_officer, msg.sender);
    }

    /**
     * @dev Adds a new judge. Only admin can add.
     */
    function addJudge(address _judge) public onlyOwner {
        authorizedJudges[_judge] = true;
        emit JudgeAdded(_judge, msg.sender);
    }

    /**
     * @dev Removes an officer. Only admin can remove.
     */
    function removeOfficer(address _officer) public onlyOwner {
        require(_officer != owner, "Cannot remove admin from officers");
        authorizedOfficers[_officer] = false;
    }

    /**
     * @dev Removes a judge. Only admin can remove.
     */
    function removeJudge(address _judge) public onlyOwner {
        authorizedJudges[_judge] = false;
    }
}
