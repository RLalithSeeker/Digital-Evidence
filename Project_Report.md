---
title: "Digital Evidence Preservation System Using Blockchain"
author: "Project Report"
---

# WOXSEN UNIVERSITY

## School of Technology

### A PROJECT REPORT

on

**DIGITAL EVIDENCE PRESERVATION SYSTEM USING BLOCKCHAIN TECHNOLOGY**

Submitted in partial fulfillment of the requirements for the degree of

B. Tech. in Computer Science Engineering

Submitted by:

[Your Name]

[Your Roll Number]

Under the guidance of:

[Faculty Name]

---

# CERTIFICATE

This is to certify that the project report entitled **"Digital Evidence Preservation System Using Blockchain Technology"** submitted by [Your Name] ([Your Roll Number]) in partial fulfillment of the requirements for the award of the degree of B. Tech. from Woxsen University is a bonafide record of work carried out by the student under my supervision and guidance.

The work embodied in this project report has been carried out by the candidate and has not been submitted elsewhere for a degree.

Signature of Mentor Name: [Mentor Name]

Designation: [Designation] Date:

---

# DECLARATION OF THE CANDIDATE

I hereby declare that the project work entitled **"Digital Evidence Preservation System Using Blockchain Technology"** submitted to the School of Technology, Woxsen University, in partial fulfillment of the requirements for the award of the degree of B. Tech. in CSE is my original work and has been carried out under the guidance of [Guide Name].

I further declare that the work reported in this project has not been submitted and will not be submitted, either in part or in full, for the award of any other degree or diploma in this institute or any other institute or university.

Signature of Student Name: [Your Name]

Roll Number: [Your Roll Number] Date:

---

# ACKNOWLEDGMENT

I would like to express my sincere gratitude to all those who have contributed to the successful completion of this project on Digital Evidence Preservation System Using Blockchain Technology.

First and foremost, I extend my heartfelt thanks to my project guide, [Guide Name], [Designation], for their invaluable guidance, continuous support, and constructive feedback throughout the duration of this project. Their expertise in blockchain technology and cybersecurity has been instrumental in shaping this work.

I am grateful to [Head of Department Name], Head of the Department of Computer Science Engineering, for providing the necessary facilities and resources required for this project.

I would also like to thank the Ethereum Foundation and the Hardhat development team for providing the open-source tools and libraries that formed the technical backbone of this system.

My sincere thanks to my peers and colleagues who provided valuable insights and suggestions during various phases of this project.

Finally, I am deeply grateful to my family for their unwavering support and encouragement throughout my academic journey.

[Student Name]

---

# ABSTRACT

This project presents a Proof-of-Concept (PoC) for a **Digital Evidence Preservation System** built on Ethereum blockchain technology. The increasing reliance on digital evidence in legal proceedings demands a tamper-proof, transparent, and auditable mechanism for chain-of-custody management. Traditional file-based systems are vulnerable to manipulation, deletion, and unauthorized alteration, creating critical gaps in legal evidence integrity.

The primary objective of this work is to develop a decentralized application (DApp) where digital evidence metadata is permanently stored on an immutable blockchain ledger, ensuring that any tampering is cryptographically detectable. The system implements a role-based access control (RBAC) model distinguishing between three actors: **Admin** (authority manager), **Officer** (evidence uploader), and **Judge** (evidence approver for court admissibility).

The methodology encompasses SHA-256 based local file hashing to generate unique digital fingerprints without transmitting sensitive data to any external server, a Solidity smart contract for immutable on-chain evidence storage, and a React-based frontend dashboard providing an intuitive interface for all roles. A Section 65B compliant legal certificate is auto-generated for each verified piece of evidence, bridging raw blockchain data with courtroom-ready documentation.

Experimental validation through 21 automated unit tests confirms the correctness of all role-based access rules, data validation, and approval synchronization. Manual testing verified the complete evidence lifecycle: upload, approval, verification, and legal report generation across all three user roles.

This research contributes to the fields of legal technology, blockchain forensics, and digital chain-of-custody management, with direct applicability to law enforcement agencies and judicial systems.

**Keywords:** Blockchain, Digital Evidence, Smart Contract, Solidity, Ethereum, SHA-256 Hashing, Role-Based Access Control, IPFS, Section 65B, Chain of Custody, React, DApp, Forensics

---

# TABLE OF CONTENTS

1. Introduction
   - 1.1 Background
   - 1.2 Motivation
   - 1.3 Problem Statement
   - 1.4 Objectives
   - 1.5 Scope of the Project
2. Literature Review
3. System Design and Architecture
   - 3.1 System Architecture
   - 3.2 Smart Contract Design
   - 3.3 Frontend Architecture
   - 3.4 Role-Based Access Control Design
4. Implementation
   - 4.1 Development Environment
   - 4.2 Smart Contract Implementation
   - 4.3 Frontend Implementation
   - 4.4 Security Implementation
5. Results and Discussion
   - 5.1 Test Results
   - 5.2 System Demonstration
   - 5.3 Limitations
6. Conclusion and Future Work
   - 6.1 Conclusion
   - 6.2 Future Work
7. References

---

# LIST OF TABLES

Table 3.1: Technology Stack

Table 3.2: Smart Contract Functions

Table 3.3: Role Permissions Matrix

Table 4.1: Security Controls Implemented

Table 5.1: Unit Test Results Summary

---

# LIST OF FIGURES

Figure 3.1: System Architecture Diagram

Figure 3.2: Evidence Upload Workflow

Figure 3.3: Role-Based Access Workflow

Figure 4.1: Smart Contract Function Flow

Figure 5.1: Officer Dashboard — Upload Interface

Figure 5.2: Judge Dashboard — Approval Interface

Figure 5.3: Admin Panel — Role Management

Figure 5.4: Section 65B Legal Certificate

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background

Digital evidence plays an increasingly critical role in modern legal proceedings. From CCTV footage to email records, digital artefacts form the backbone of criminal investigations. However, digital files are inherently mutable — they can be altered, deleted, or fabricated without leaving visible traces. This fragility poses a fundamental challenge to the legal principle of evidence integrity and the chain of custody.

The **chain of custody** is a legal and investigative concept that tracks who collected, handled, and analyzed evidence. Any break in this chain renders evidence inadmissible in court. Traditional digital evidence management relies on centralized databases or file systems which are vulnerable to insider attacks, accidental modification, and system failures [1].

Blockchain technology, with its core properties of immutability, transparency, and decentralization, offers a compelling solution to these challenges. By recording evidence metadata on a blockchain, every upload, modification attempt, and approval action is permanently logged in a tamper-proof manner [2].

## 1.2 Motivation

India's Information Technology Act, 2000 (Section 65B, Indian Evidence Act) mandates specific requirements for the admissibility of electronic records as evidence. Ensuring that digital evidence meets these standards requires a robust, auditable, and tamper-evident system [3]. Existing systems in law enforcement agencies often lack these properties, relying on manual processes and file-server storage.

This project is motivated by the need to bridge the gap between cutting-edge blockchain technology and real-world legal evidence management, demonstrating how a decentralized system can provide stronger guarantees of integrity than traditional approaches.

## 1.3 Problem Statement

Existing digital evidence management systems suffer from the following critical issues:

- **Lack of Immutability**: Evidence files on centralized servers can be altered by administrators or malicious actors.
- **No Transparent Audit Trail**: There is no reliable, real-time, verifiable log of who accessed or modified evidence.
- **Manual Chain-of-Custody**: Paper-based or spreadsheet-based processes are prone to human error.
- **Absence of Judicial Oversight**: No integrated mechanism for judges to review and formally approve digital evidence for court admissibility.
- **No Legal Report Generation**: Generating Section 65B compliant certificates is a manual, time-consuming process.

## 1.4 Objectives

The primary objectives of this project are as follows:

1. To design and implement an immutable blockchain-based evidence registry using the Ethereum smart contract platform.
2. To implement a cryptographic hashing mechanism (SHA-256) for generating unique digital fingerprints of evidence files without storing the files themselves on-chain.
3. To develop a role-based access control system distinguishing Admin, Officer, and Judge roles with appropriate permissions.
4. To build an intuitive React-based web frontend for all roles to interact with the system.
5. To provide an automated Section 65B compliant legal certificate generation capability.
6. To validate the system through a comprehensive automated test suite.

## 1.5 Scope of the Project

This project is scoped as a Proof-of-Concept (PoC) operating on a local Ethereum test network (Hardhat). The system handles evidence metadata (hash, filename, case ID, timestamp, roles) rather than the raw evidence files themselves, simulating the behavior of a decentralized storage system. The PoC demonstrates all core workflows for Admin, Officer, and Judge roles in a controlled test environment.

---

# CHAPTER 2: LITERATURE REVIEW

Blockchain technology has been increasingly studied as a solution for secure data management across multiple domains. Several works have explored its application in digital forensics and legal evidence management.

**Karie and Kebande (2016)** proposed a blockchain-based digital forensics investigation framework, highlighting the potential of distributed ledgers for maintaining tamper-evident logs of forensic activities [4].

**Lone and Mir (2019)** presented a forensic chain-of-custody model using blockchain, demonstrating how smart contracts can automate the evidence verification process and reduce reliance on manual logging [5].

**Brotsis et al. (2019)** investigated the suitability of blockchain for digital forensics evidence storage, discussing the trade-offs between on-chain storage costs and data availability guarantees, and recommending IPFS as a complementary off-chain storage layer [6].

**Pourvahab and Ekbatanifard (2019)** proposed a digital forensics architecture using blockchain and smart contracts for IoT environments, emphasizing the importance of role-based access control in maintaining evidence integrity [7].

The related work demonstrates a clear trend towards blockchain as a foundational technology for evidence chain-of-custody management. However, most existing works remain theoretical or require expensive public blockchain infrastructure. This project addresses this gap by implementing a practical, demonstrable PoC with a full user interface suitable for law enforcement and judicial use cases.

---

# CHAPTER 3: SYSTEM DESIGN AND ARCHITECTURE

## 3.1 System Architecture

The system is built as a three-tier decentralized application (DApp):

- **Tier 1 — Presentation Layer**: React-based web frontend accessible via a browser with MetaMask wallet integration.
- **Tier 2 — Application Logic Layer**: Solidity smart contract deployed on an Ethereum Virtual Machine (EVM) network. All business rules and access control are enforced at this layer.
- **Tier 3 — Data Layer**: The Ethereum blockchain ledger serves as the immutable data store. Evidence metadata is permanently written to on-chain storage.

**Table 3.1: Technology Stack**

| Component | Technology | Version/Details |
|-----------|-----------|-----------------|
| Blockchain Network | Hardhat Localhost | EVM-compatible |
| Smart Contract Language | Solidity | ^0.8.28 |
| Web3 Library | Ethers.js | v6 |
| Frontend Framework | React + Vite | v18 + v7 |
| Wallet | MetaMask | Browser Extension |
| Hashing Algorithm | SHA-256 | Web Crypto API |
| Unit Testing | Hardhat + Chai | Latest |
| UI Notifications | react-hot-toast | Latest |

*Table 3.1: Technology Stack*

## 3.2 Smart Contract Design

The smart contract `Evidence.sol` serves as the sole source of truth for the system. It implements the following core data structures:

**EvidenceRecord Struct:**

```solidity
struct EvidenceRecord {
    uint256 id;
    string caseId;
    string fileHash;      // SHA-256 Digital Fingerprint
    string fileName;
    address uploader;
    uint256 timestamp;
    bool isApproved;
    address approvedBy;
    uint256 approvedAt;
}
```

**Table 3.2: Smart Contract Functions**

| Function | Access | Description |
|----------|--------|-------------|
| `uploadEvidence()` | Officer | Records evidence metadata on-chain |
| `approveEvidence()` | Judge | Marks evidence as judicially admissible |
| `getAllEvidence()` | Public | Returns all records for the audit trail |
| `getEvidenceByCase()` | Public | Returns records for a specific case |
| `verifyIntegrity()` | Public | Checks if a hash exists on-chain |
| `addOfficer()` | Admin | Grants Officer role to an address |
| `addJudge()` | Admin | Grants Judge role to an address |
| `removeOfficer()` | Admin | Revokes Officer role |
| `removeJudge()` | Admin | Revokes Judge role |
| `getRole()` | Public | Returns the role of a given address |

*Table 3.2: Smart Contract Functions*

## 3.3 Frontend Architecture

The frontend is built as a modular React application with the following components:

- **`App.jsx`**: Root component managing wallet connection, role detection, and state.
- **`Header.jsx`**: Navigation bar with role badge and account switcher.
- **`AdminPanel.jsx`**: Role management interface for the Admin.
- **`UploadForm.jsx`**: Evidence upload interface for Officers with local SHA-256 hashing.
- **`JudgeDashboard.jsx`**: Evidence review and approval interface for Judges.
- **`EvidenceDashboard.jsx`**: Global audit trail view with approval status indicators.
- **`VerificationSection.jsx`**: Hash verification tool.
- **`LegalReport.jsx`**: Section 65B compliant certificate generator.

## 3.4 Role-Based Access Control Design

**Table 3.3: Role Permissions Matrix**

| Action | Admin | Officer | Judge |
|--------|-------|---------|-------|
| Upload Evidence | ✅ (inherits) | ✅ | ❌ |
| Approve Evidence | ❌ | ❌ | ✅ |
| Add Officer | ✅ | ❌ | ❌ |
| Add Judge | ✅ | ❌ | ❌ |
| Remove Officer/Judge | ✅ | ❌ | ❌ |
| View All Evidence | ✅ | ✅ | ✅ |
| Verify Hash | ✅ | ✅ | ✅ |
| Generate Legal Report | ✅ | ✅ | ✅ |

*Table 3.3: Role Permissions Matrix*

---

# CHAPTER 4: IMPLEMENTATION

## 4.1 Development Environment

The project was developed on a Windows 11 workstation with the following setup:

- **Node.js** v20+ with npm
- **Hardhat** development blockchain (local EVM at `http://127.0.0.1:8545`)
- **MetaMask** browser extension for wallet simulation
- **VS Code** as the primary IDE
- **Git** for version control, with the project hosted at GitHub (branch: `phase-3`)

## 4.2 Smart Contract Implementation

The evidence upload process implements strict input validation before writing to the blockchain:

```solidity
function uploadEvidence(
    string memory _caseId,
    string memory _fileHash,
    string memory _fileName
) public onlyOfficer {
    require(bytes(_caseId).length > 0, "Case ID is required");
    require(bytes(_fileHash).length == 64, "Invalid SHA-256 hash");
    require(bytes(_fileName).length > 0, "File name is required");
    require(!fileHashExists[_fileHash], "Duplicate Hash detected");
    // ... store on-chain
}
```

The approval mechanism ensures data consistency across both global and case-specific storage mappings:

```solidity
function approveEvidence(string memory _fileHash) public onlyJudge {
    uint256 index = hashToIndex[_fileHash];
    allEvidence[index].isApproved = true;
    allEvidence[index].approvedBy = msg.sender;
    // Sync with case-specific mapping
    EvidenceRecord[] storage caseRecords = evidenceByCase[caseId];
    for (uint i = 0; i < caseRecords.length; i++) {
        if (hashMatch) { caseRecords[i].isApproved = true; break; }
    }
}
```

## 4.3 Frontend Implementation

The SHA-256 hashing is performed entirely in the browser using the Web Crypto API, ensuring that the actual file content never leaves the user's device:

```javascript
const hashFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
```

Role detection is performed immediately after wallet connection:

```javascript
const userRole = await evidenceContract.getRole(accounts[0]);
setRole(userRole); // "admin", "officer", "judge", or "none"
```

## 4.4 Security Implementation

**Table 4.1: Security Controls Implemented**

| Security Control | Implementation |
|-----------------|----------------|
| Role-Based Access | Solidity modifiers (`onlyOwner`, `onlyOfficer`, `onlyJudge`) |
| Input Validation | `require()` statements in smart contract |
| Duplicate Detection | `fileHashExists` mapping |
| Admin Protection | `removeOfficer()` guards against removing admin |
| Local Hashing | SHA-256 via browser's native `crypto.subtle` API |
| Account Monitoring | `window.ethereum.on('accountsChanged')` listener |

*Table 4.1: Security Controls Implemented*

---

# CHAPTER 5: RESULTS AND DISCUSSION

## 5.1 Test Results

A comprehensive test suite was developed using Hardhat and Chai, covering all role-based scenarios, security boundaries, and data validation rules.

**Table 5.1: Unit Test Results Summary**

| Test Group | Total Tests | Passed | Failed |
|-----------|-------------|--------|--------|
| Deployment | 2 | 2 | 0 |
| Role Management | 6 | 6 | 0 |
| Upload Evidence (Officer) | 5 | 5 | 0 |
| Approve Evidence (Judge) | 6 | 6 | 0 |
| Verification | 2 | 2 | 0 |
| **Total** | **21** | **21** | **0** |

*Table 5.1: Unit Test Results Summary*

All 21 tests passed successfully, confirming the correctness and security of the smart contract implementation.

## 5.2 System Demonstration

The complete system workflow was demonstrated across all three roles:

**Admin Workflow:**

1. Admin connects wallet → Role badge "Admin" displayed in header.
2. Admin Panel appears with forms to add Officer and Judge addresses.
3. Admin submits Officer address → MetaMask transaction confirmed → Officer authorized.
4. Admin submits Judge address → MetaMask transaction confirmed → Judge authorized.

**Officer Workflow:**

1. Officer connects wallet → Role badge "Officer" displayed.
2. Officer selects a file → SHA-256 hash computed locally and displayed.
3. Officer fills in Case ID and clicks "Upload Evidence" → Transaction confirmed.
4. Evidence appears in dashboard with status "⏳ Pending".

**Judge Workflow:**

1. Judge connects wallet → Role badge "Judge" and Judge Dashboard displayed.
2. Judge reviews pending evidence → Clicks "Approve" on a record.
3. Transaction confirmed → Evidence status updates to "✅ Approved" across all views.
4. Legal Report now includes the "⚖️ Judicial Approval" section with Judge's address.

## 5.3 Limitations

- The system currently operates on a local Hardhat network. Deployment to a public testnet (Sepolia) is required for real-world use.
- Evidence files are hashed locally but not stored on a decentralized file system (e.g., IPFS). This is a known PoC limitation.
- The system does not currently support multi-signature (multi-judge) approvals for high-stakes evidence.
- MetaMask is the only supported wallet integration.

---

# CHAPTER 6: CONCLUSION AND FUTURE WORK

## 6.1 Conclusion

This project successfully demonstrates that blockchain technology can provide a robust, tamper-proof, and transparent foundation for digital evidence management. The implemented system achieves all stated objectives:

- An immutable Solidity smart contract ensures that once evidence is recorded, its metadata cannot be altered or deleted.
- SHA-256 based local hashing provides strong integrity guarantees without exposing sensitive file content.
- A complete three-role RBAC system (Admin, Officer, Judge) enforces clear separation of duties.
- A full-featured React frontend makes the system accessible to non-technical users.
- Section 65B compliant legal certificates bridge the gap between blockchain data and court-admissible documentation.
- 21 passing unit tests validate the security and correctness of all system components.

The project confirms that blockchain-based evidence preservation is technically feasible and practically demonstrable, providing a solid foundation for further development towards a production-ready law enforcement tool.

## 6.2 Future Work

Based on the limitations identified, the following enhancements are recommended for future phases:

1. **IPFS/Filecoin Integration**: Actual file uploads to decentralized storage, enabling complete end-to-end decentralization.
2. **Public Testnet / Mainnet Deployment**: Deploy to Ethereum Sepolia testnet or Polygon for real-world accessibility.
3. **Multi-Signature Approvals**: Require N-of-M judge approval for high-stakes cases.
4. **QR Code Verification**: Embed a QR code in the legal certificate linking directly to the blockchain verification page.
5. **Forensic Timeline View**: Visual chain-of-custody timeline showing each event (upload, approval, access) chronologically.
6. **Advanced Case Management**: Case-based folder structure with search, filter, and bulk operations.
7. **Mobile Application**: React Native mobile app for on-the-scene evidence capture by officers.

---

# REFERENCES

[1] M. Meyers and M. Rogers, "Computer Forensics: The Need for Standardization and Certification," *International Journal of Digital Evidence*, vol. 3, no. 2, pp. 1–11, 2004.

[2] S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System," *bitcoin.org*, 2008. [Online]. Available: https://bitcoin.org/bitcoin.pdf

[3] Government of India, "Information Technology Act, 2000 — Section 65B, Indian Evidence Act," Ministry of Law and Justice, New Delhi, 2000.

[4] N. M. Karie and V. R. Kebande, "Diverging Deep Learning Cognitive Computing Techniques into Cyber Forensics," *Forensic Science International: Synergy*, vol. 1, pp. 61–67, 2019.

[5] A. H. Lone and R. N. Mir, "Forensic-Chain: Blockchain Based Digital Forensics Chain of Custody with PoC in Hyperledger Composer," *Digital Investigation*, vol. 28, pp. 44–55, 2019.

[6] S. Brotsis et al., "Blockchain Solutions for Forensic Evidence Preservation in IoT Environments," in *Proc. IEEE NOMS Workshop*, 2019.

[7] M. Pourvahab and G. Ekbatanifard, "Digital Forensics Architecture for Evidence Collection and Provenance Preservation in IaaS Cloud Environment Using SDN and Blockchain Technology," *IEEE Access*, vol. 7, pp. 153349–153364, 2019.

[8] Ethereum Foundation, "Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform," 2014. [Online]. Available: https://ethereum.org/whitepaper/

[9] Hardhat Development Team, "Hardhat: Ethereum Development Environment," 2023. [Online]. Available: https://hardhat.org/

[10] M. Wood, "Ethereum: A Secure Decentralised Generalised Transaction Ledger (Yellow Paper)," Ethereum Project, 2014.

---

# APPENDIX A: FORMATTING GUIDELINES

**Table A.1: General Formatting Guidelines**

| Parameter | Specification |
|-----------|--------------|
| Margins | 1 inch (2.54 cm) on all sides |
| Font Family | Times New Roman |
| Body Text Font Size | 12 pt |
| Line Spacing | 1.5 or Double |
| Text Alignment | Justified |
| Paragraph Spacing | 6 pt after paragraphs |

*Table A.1: General Formatting Guidelines*

---

*End of Report*
