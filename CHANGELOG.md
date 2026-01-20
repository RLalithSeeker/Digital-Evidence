# Changelog

## [Phase 4] - 2026-01-20

### Added
- **Role-Based Access Control**
  - `Officer` role: Can upload evidence only
  - `Judge` role: Can view and approve evidence for court admissibility
  - `Admin` role: Can add/remove Officers and Judges
- **Admin Panel UI**: Add Officers and Judges via dashboard
- **Judge Dashboard**: Dedicated view with "Approve" buttons
- **Role Indicator**: Badge in header showing current role (Admin/Officer/Judge)
- **Account Switcher**: Click account address to switch MetaMask accounts
- **Auto-Refresh**: UI updates automatically when account changes

### Security Improvements
- **Input Validation**: Case ID required, SHA-256 hash must be 64 chars, file name required
- **Role Removal**: `removeOfficer()` and `removeJudge()` functions
- **Protection**: Admin cannot be removed from officers

### Code Quality
- **Frontend Refactoring**: Split monolithic `App.jsx` into components:
  - `Header.jsx`
  - `UploadForm.jsx`
  - `EvidenceDashboard.jsx`
  - `VerificationSection.jsx`
  - `LegalReport.jsx`
  - `JudgeDashboard.jsx`
  - `AdminPanel.jsx`
- **Toast Notifications**: Replaced browser `alert()` with `react-hot-toast`
- **Test Suite**: 20 tests covering all roles and validation

### Technical Details
- Contract: `Evidence.sol` (Solidity ^0.8.28)
- Frontend: React + Vite + Ethers.js v6
- Tests: Hardhat + Chai

---

## [Phase 3] - 2026-01-17

### Added
- Simulated IPFS (SHA-256 local hashing)
- Global Evidence Dashboard
- Section 65B Legal Certificate generation
- Local file preview during upload
