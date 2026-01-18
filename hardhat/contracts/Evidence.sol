// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Digital Evidence Preservation Contract
 * @dev Stores evidence metadata on-chain with role-based access control.
 */
contract Evidence {
    
    // Structure to hold evidence details
    struct EvidenceRecord {
        string ipfsHash;    // IPFS Hash of the file
        string caseId;      // Case ID associated with the evidence
        address uploader;   // Address of the officer who uploaded
        uint256 timestamp;  // Block timestamp of upload
    }

    // Mapping from IPFS Hash to Evidence Record
    mapping(string => EvidenceRecord) public evidenceRecords;
    
    // List of authorized officers
    mapping(address => bool) public authorizedOfficers;

    // Event emitted when evidence is uploaded
    event EvidenceUploaded(string ipfsHash, string caseId, address indexed uploader, uint256 timestamp);

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
     * @param _ipfsHash The IPFS hash of the uploaded file.
     * @param _caseId The case ID associated with the evidence.
     */
    function uploadEvidence(string memory _ipfsHash, string memory _caseId) public onlyOfficer {
        // Ensure evidence doesn't already exist for this hash
        require(bytes(evidenceRecords[_ipfsHash].ipfsHash).length == 0, "Evidence already exists");

        // Create record
        evidenceRecords[_ipfsHash] = EvidenceRecord({
            ipfsHash: _ipfsHash,
            caseId: _caseId,
            uploader: msg.sender,
            timestamp: block.timestamp
        });

        emit EvidenceUploaded(_ipfsHash, _caseId, msg.sender, block.timestamp);
    }

    /**
     * @dev Adds a new officer. Only owner can add.
     */
    function addOfficer(address _officer) public {
        require(msg.sender == owner, "Only owner can add officers");
        authorizedOfficers[_officer] = true;
    }
    
    /**
     * @dev Verifies if evidence exists and returns details.
     */
    function verifyEvidence(string memory _ipfsHash) public view returns (string memory, string memory, address, uint256) {
        require(bytes(evidenceRecords[_ipfsHash].ipfsHash).length != 0, "Evidence not found");
        EvidenceRecord memory record = evidenceRecords[_ipfsHash];
        return (record.ipfsHash, record.caseId, record.uploader, record.timestamp);
    }
}
