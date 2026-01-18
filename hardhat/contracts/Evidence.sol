// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Digital Evidence Preservation Contract (Phase 3)
 * @dev Stores evidence metadata on-chain with role-based access control.
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
    }

    // Array to store all evidence IDs (for counting)
    uint256 private _evidenceIds;

    // Mappings
    mapping(string => EvidenceRecord[]) private evidenceByCase; // caseId => Evidence List
    mapping(string => bool) public fileHashExists;             // fast existence check

    // Mapping of authorized officers
    mapping(address => bool) public authorizedOfficers;

    // Event emitted when evidence is uploaded
    event EvidenceUploaded(string indexed caseId, string fileHash, string fileName, address indexed uploader, uint256 timestamp);

    address public owner;

    // Modifier to restrict access to authorized officers only
    modifier onlyOfficer() {
        require(authorizedOfficers[msg.sender], "Not an authorized officer");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Deployer is the first authorized officer
        authorizedOfficers[msg.sender] = true;
    }

    /**
     * @dev Uploads evidence metadata to the blockchain.
     * @param _caseId The case ID associated with the evidence.
     * @param _fileHash The SHA-256 hash of the uploaded file.
     * @param _fileName The name of the file.
     */
    function uploadEvidence(string memory _caseId, string memory _fileHash, string memory _fileName) public onlyOfficer {
        // Ensure evidence doesn't already exist for this hash
        require(!fileHashExists[_fileHash], "Evidence integrity check failed: Duplicate Hash");

        _evidenceIds++;
        uint256 newId = _evidenceIds;

        EvidenceRecord memory newEvidence = EvidenceRecord({
            id: newId,
            caseId: _caseId,
            fileHash: _fileHash,
            fileName: _fileName,
            uploader: msg.sender,
            timestamp: block.timestamp
        });

        // Store in mappings
        evidenceByCase[_caseId].push(newEvidence);
        fileHashExists[_fileHash] = true;

        emit EvidenceUploaded(_caseId, _fileHash, _fileName, msg.sender, block.timestamp);
    }

    /**
     * @dev Returns all evidence for a specific case.
     */
    function getEvidenceByCase(string memory _caseId) public view returns (EvidenceRecord[] memory) {
        return evidenceByCase[_caseId];
    }
    
    /**
     * @dev Verifies if a file hash exists on-chain.
     */
    function verifyIntegrity(string memory _fileHash) public view returns (bool) {
        return fileHashExists[_fileHash];
    }

    /**
     * @dev Adds a new officer. Only owner can add.
     */
    function addOfficer(address _officer) public {
        require(msg.sender == owner, "Only owner can add officers");
        authorizedOfficers[_officer] = true;
    }
}
