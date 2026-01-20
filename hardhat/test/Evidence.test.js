const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Evidence Contract (Phase 4 - Roles)", function () {
    let Evidence;
    let evidence;
    let owner;
    let officer;
    let judge;
    let unauthorized;

    // Valid 64-character SHA-256 hashes for testing
    const HASH_1 = "a".repeat(64); // aaaa...64 chars
    const HASH_2 = "b".repeat(64);
    const HASH_3 = "c".repeat(64);
    const HASH_4 = "d".repeat(64);
    const HASH_5 = "e".repeat(64);

    beforeEach(async function () {
        [owner, officer, judge, unauthorized] = await ethers.getSigners();
        Evidence = await ethers.getContractFactory("Evidence");
        evidence = await Evidence.deploy();

        // Setup roles
        await evidence.addOfficer(officer.address);
        await evidence.addJudge(judge.address);
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await evidence.owner()).to.equal(owner.address);
        });

        it("Should authorize the owner as an officer", async function () {
            expect(await evidence.authorizedOfficers(owner.address)).to.equal(true);
        });
    });

    describe("Role Management", function () {
        it("Should return 'admin' for owner", async function () {
            expect(await evidence.getRole(owner.address)).to.equal("admin");
        });

        it("Should return 'officer' for added officer", async function () {
            expect(await evidence.getRole(officer.address)).to.equal("officer");
        });

        it("Should return 'judge' for added judge", async function () {
            expect(await evidence.getRole(judge.address)).to.equal("judge");
        });

        it("Should return 'none' for unauthorized address", async function () {
            expect(await evidence.getRole(unauthorized.address)).to.equal("none");
        });

        it("Should fail if non-admin tries to add officer", async function () {
            await expect(
                evidence.connect(officer).addOfficer(unauthorized.address)
            ).to.be.revertedWith("Only admin can perform this action");
        });

        it("Should fail if non-admin tries to add judge", async function () {
            await expect(
                evidence.connect(officer).addJudge(unauthorized.address)
            ).to.be.revertedWith("Only admin can perform this action");
        });
    });

    describe("Upload Evidence (Officer)", function () {
        it("Should allow officer to upload evidence", async function () {
            await expect(evidence.connect(officer).uploadEvidence("CASE-123", HASH_1, "video.mp4"))
                .to.emit(evidence, "EvidenceUploaded");
        });

        it("Should fail if judge tries to upload", async function () {
            await expect(
                evidence.connect(judge).uploadEvidence("CASE-1", HASH_2, "file.txt")
            ).to.be.revertedWith("Not an authorized officer");
        });

        it("Should fail if unauthorized user tries to upload", async function () {
            await expect(
                evidence.connect(unauthorized).uploadEvidence("CASE-1", HASH_2, "file.txt")
            ).to.be.revertedWith("Not an authorized officer");
        });

        it("Should fail with invalid hash length", async function () {
            await expect(
                evidence.connect(officer).uploadEvidence("CASE-1", "short", "file.txt")
            ).to.be.revertedWith("Invalid SHA-256 hash (must be 64 characters)");
        });

        it("Should fail with empty case ID", async function () {
            await expect(
                evidence.connect(officer).uploadEvidence("", HASH_3, "file.txt")
            ).to.be.revertedWith("Case ID is required");
        });
    });

    describe("Approve Evidence (Judge)", function () {
        beforeEach(async function () {
            await evidence.connect(officer).uploadEvidence("CASE-APPROVE", HASH_4, "evidence.pdf");
        });

        it("Should allow judge to approve evidence", async function () {
            await expect(evidence.connect(judge).approveEvidence(HASH_4))
                .to.emit(evidence, "EvidenceApproved");
        });

        it("Should mark evidence as approved", async function () {
            await evidence.connect(judge).approveEvidence(HASH_4);
            const allEvidence = await evidence.getAllEvidence();
            expect(allEvidence[0].isApproved).to.equal(true);
            expect(allEvidence[0].approvedBy).to.equal(judge.address);
        });

        it("Should fail if officer tries to approve", async function () {
            await expect(
                evidence.connect(officer).approveEvidence(HASH_4)
            ).to.be.revertedWith("Not an authorized judge");
        });

        it("Should fail if evidence is already approved", async function () {
            await evidence.connect(judge).approveEvidence(HASH_4);
            await expect(
                evidence.connect(judge).approveEvidence(HASH_4)
            ).to.be.revertedWith("Evidence already approved");
        });

        it("Should fail if evidence does not exist", async function () {
            await expect(
                evidence.connect(judge).approveEvidence(HASH_5)
            ).to.be.revertedWith("Evidence not found");
        });
    });

    describe("Verification", function () {
        it("Should return true for valid hash", async function () {
            await evidence.connect(officer).uploadEvidence("CASE-V", HASH_5, "doc.pdf");
            expect(await evidence.verifyIntegrity(HASH_5)).to.equal(true);
        });

        it("Should return false for invalid hash", async function () {
            expect(await evidence.verifyIntegrity("f".repeat(64))).to.equal(false);
        });
    });
});
