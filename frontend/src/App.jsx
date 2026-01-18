import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import EvidenceAbi from './contracts/Evidence.json'
import EvidenceAddress from './contracts/Evidence-address.json'

function App() {
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)

  // Upload State
  const [caseId, setCaseId] = useState('')
  const [file, setFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')

  // Verify State
  const [verifyHash, setVerifyHash] = useState('')
  const [verificationResult, setVerificationResult] = useState(null)

  // Report State
  const [showReport, setShowReport] = useState(false)
  const [reportData, setReportData] = useState(null)

  // MOCK IPFS Handler (Simulated for PoC)
  const mockUploadToIPFS = async (file) => {
    // In a real system, use ipfs-http-client here.
    // For PoC, we generate a pseudo-hash based on file name and time.
    return "Qm" + ethers.id(file.name + Date.now()).substring(2, 48);
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])

        // Auto-Switch to Localhost 8545
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x539' }], // Chain ID 1337
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x539',
                  chainName: 'Localhost 8545',
                  rpcUrls: ['http://127.0.0.1:8545'],
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
                }],
              });
            } catch (addError) {
              console.error("Failed to add network", addError);
            }
          }
          // Handle other errors (like user rejection)
        }

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const evidenceContract = new ethers.Contract(EvidenceAddress.address, EvidenceAbi.abi, signer)
        setContract(evidenceContract)
      } catch (error) {
        console.error("Connection failed", error)
        alert("Failed to connect wallet.")
      }
    } else {
      alert("Please install Metamask!")
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!contract || !file || !caseId) return;

    try {
      setUploadStatus("Uploading to IPFS (Simulated)...")
      const ipfsHash = await mockUploadToIPFS(file)

      setUploadStatus("Waiting for user signature...")
      const tx = await contract.uploadEvidence(ipfsHash, caseId)

      setUploadStatus("Transaction pending...")
      await tx.wait()

      setUploadStatus(`Success! Evidence Hash: ${ipfsHash}`)
      setVerifyHash(ipfsHash) // Auto-fill verify for convenience
    } catch (error) {
      console.error(error)
      setUploadStatus("Upload Failed: " + (error.reason || error.message))
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!contract || !verifyHash) return;

    try {
      const result = await contract.verifyEvidence(verifyHash)
      // result: [ipfsHash, caseId, uploader, timestamp]
      const timestamp = new Date(Number(result[3]) * 1000).toLocaleString()

      setVerificationResult({
        ipfsHash: result[0],
        caseId: result[1],
        uploader: result[2],
        timestamp: timestamp,
        status: "Valid & On-Chain"
      })
      setReportData({
        ipfsHash: result[0],
        caseId: result[1],
        uploader: result[2],
        timestamp: timestamp
      })
    } catch (error) {
      setVerificationResult({ status: "Not Found / Invalid" })
    }
  }

  const generateReport = () => {
    setShowReport(true)
    setTimeout(() => window.print(), 500)
  }

  return (
    <div className="container">
      <header>
        <h1>⛓️ Digital Evidence Preservation</h1>
        {!account ? (
          <button onClick={connectWallet} className="primary-btn">Connect Wallet</button>
        ) : (
          <p className="status">Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
        )}
      </header>

      <main>
        {/* Upload Section */}
        <section className="card">
          <h2>📤 Upload Evidence</h2>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Case ID</label>
              <input
                type="text"
                placeholder="Ex: CASE-2024-001"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Select File</label>
              <input type="file" onChange={handleFileChange} />
            </div>
            <button type="submit" disabled={!contract} className="action-btn">
              Secure Upload
            </button>
          </form>
          {uploadStatus && <p className="status-msg">{uploadStatus}</p>}
        </section>

        {/* Verify Section */}
        <section className="card">
          <h2>🔍 Verify Evidence</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter IPFS Hash / Evidence ID"
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
            />
            <button onClick={handleVerify} disabled={!contract} className="secondary-btn">Verify</button>
          </div>

          {verificationResult && (
            <div className={`result-box ${verificationResult.status === "Valid & On-Chain" ? "valid" : "invalid"}`}>
              <h3>Status: {verificationResult.status}</h3>
              {verificationResult.caseId && (
                <>
                  <p><strong>Case ID:</strong> {verificationResult.caseId}</p>
                  <p><strong>Uploader:</strong> {verificationResult.uploader}</p>
                  <p><strong>Timestamp:</strong> {verificationResult.timestamp}</p>
                  <button onClick={generateReport} className="report-btn">📄 Generate Legal Report (Section 65B)</button>
                </>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Legal Report Overlay (Visible only when generating) */}
      {showReport && reportData && (
        <div className="print-overlay" onClick={() => setShowReport(false)}>
          <div className="certificate">
            <h1>Certificate of Electronic Evidence (Section 65B)</h1>
            <p className="cert-meta">Generated via Private Consortium Blockchain</p>
            <hr />
            <div className="cert-body">
              <p><strong>Case Reference:</strong> {reportData.caseId}</p>
              <p><strong>Digital Fingerprint (Hash):</strong> <br /><code>{reportData.ipfsHash}</code></p>
              <p><strong>Uploaded By (Officer ID):</strong> <br />{reportData.uploader}</p>
              <p><strong>Blockchain Timestamp:</strong> {reportData.timestamp}</p>
              <p><strong>Verification Status:</strong> IMMUTABLE & VERIFIED</p>
            </div>
            <div className="cert-footer">
              <p>This document certifies that the electronic record identified above has been preserved on a secure blockchain ledger and has not been tampered with.</p>
              <div className="signatures">
                <div>______________________<br />Authorized Signatory</div>
                <div>______________________<br />Date</div>
              </div>
            </div>
            <button className="no-print close-btn" onClick={(e) => { e.stopPropagation(); setShowReport(false) }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
