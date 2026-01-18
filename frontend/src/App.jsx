import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Shield, UploadCloud, Search, FileText, Loader2, CheckCircle, AlertCircle, Wallet, FileCheck } from 'lucide-react'
import './App.css'
import EvidenceAbi from './contracts/Evidence.json'
import EvidenceAddress from './contracts/Evidence-address.json'

function App() {
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)

  // Dashboard State
  const [evidenceList, setEvidenceList] = useState([])
  const [isLoadingList, setIsLoadingList] = useState(false)

  // Upload State
  const [caseId, setCaseId] = useState('')
  const [file, setFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Verify State
  const [verifyHash, setVerifyHash] = useState('')
  const [verificationResult, setVerificationResult] = useState(null)

  // Report State
  const [showReport, setShowReport] = useState(false)
  const [reportData, setReportData] = useState(null)

  // --- Requirement 3: Simulated IPFS (SHA-256 Hashing) ---
  const generateHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
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
        }

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const evidenceContract = new ethers.Contract(EvidenceAddress.address, EvidenceAbi.abi, signer)
        setContract(evidenceContract)
        // Ideally load evidence here if we had a "getAllEvidence" or specific case to load
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
      setIsUploading(true)
      setUploadStatus("Hashing File (SHA-256)...")

      // Phase 3: Simulated IPFS / Local Hashing
      const fileHash = await generateHash(file)
      console.log("Generated SHA-256 Hash:", fileHash)

      setUploadStatus("Awaiting Blockchain Signature...")
      // Call Phase 3 Smart Contract Function
      const tx = await contract.uploadEvidence(caseId, fileHash, file.name)

      setUploadStatus("Mining Transaction...")
      await tx.wait()

      setUploadStatus(`Evidence Secured! Hash: ${fileHash.substring(0, 10)}...`)
      setVerifyHash(fileHash)

      // Update local list (Mock update since we don't have a global getter in contract yet)
      const newRecord = {
        id: Date.now(), // Temporary ID for UI
        caseId: caseId,
        fileName: file.name,
        fileHash: fileHash,
        uploader: account,
        timestamp: new Date().toLocaleString()
      }
      setEvidenceList(prev => [newRecord, ...prev])

    } catch (error) {
      console.error(error)
      setUploadStatus("Upload Failed: " + (error.reason || error.message))
    } finally {
      setIsUploading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!contract || !verifyHash) return;

    try {
      // Phase 3: Integrity Check
      const isValid = await contract.verifyIntegrity(verifyHash)

      if (isValid) {
        setVerificationResult({
          status: "Valid & On-Chain",
          fileHash: verifyHash
          // Note: Phase 3 contract verifyIntegrity only returns bool. 
          // To get details we'd need to query by Case ID or have a mapping by Hash -> Record
        })
        // For report generation, we try to find it in our local list or just use what we have
        const foundLocal = evidenceList.find(e => e.fileHash === verifyHash)
        if (foundLocal) {
          setReportData(foundLocal)
        } else {
          // Minimal report data
          setReportData({
            caseId: "Unknown (Query by Case ID for details)",
            fileHash: verifyHash,
            uploader: "Verified On-Chain",
            timestamp: "Verified On-Chain"
          })
        }
      } else {
        setVerificationResult({ status: "Not Found / Invalid" })
      }
    } catch (error) {
      console.error(error)
      setVerificationResult({ status: "Error Verifying" })
    }
  }

  const fetchEvidenceByCase = async () => {
    if (!contract || !caseId) return;
    setIsLoadingList(true)
    try {
      const records = await contract.getEvidenceByCase(caseId)
      // Transform struct to UI object
      const formattedRecords = records.map(r => ({
        id: r.id.toString(),
        caseId: r.caseId,
        fileHash: r.fileHash,
        fileName: r.fileName,
        uploader: r.uploader,
        timestamp: new Date(Number(r.timestamp) * 1000).toLocaleString()
      }))
      setEvidenceList(formattedRecords)
    } catch (error) {
      console.error("Fetch failed", error)
    } finally {
      setIsLoadingList(false)
    }
  }

  // --- Requirement 4: Section 65B Compliance Report ---
  const generateReport = () => {
    setShowReport(true)
    setTimeout(() => window.print(), 500)
  }

  return (
    <div className="container">
      <header>
        <h1>
          <Shield className="icon-logo" size={32} /> Digital Evidence Vault
        </h1>
        {!account ? (
          <button onClick={connectWallet} className="primary-btn">
            <Wallet size={18} /> Connect Wallet
          </button>
        ) : (
          <div className="status">
            <span className="live-indicator">●</span>
            {account.substring(0, 6)}...{account.substring(38)}
          </div>
        )}
      </header>

      <main>
        {/* Upload Section */}
        <section className="glass-card">
          <h2><UploadCloud className="icon-title" /> Phase 3: Secure Upload</h2>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Case Reference ID</label>
              <input
                type="text"
                placeholder="Ex: CASE-2024-X1"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Digital Asset (Auto-Hashed locally)</label>
              <div className="file-input-wrapper">
                <input type="file" onChange={handleFileChange} />
              </div>
            </div>
            <button type="submit" disabled={!contract || isUploading} className="action-btn">
              {isUploading ? <Loader2 className="spin" /> : <Shield size={20} />}
              {isUploading ? " Hashing & Uploading..." : (contract ? " Secure Evidence On-Chain" : " Connect Wallet to Upload")}
            </button>
          </form>
          {uploadStatus && (
            <div className="status-msg">
              {isUploading ? <Loader2 className="spin" size={16} /> : <CheckCircle size={16} />}
              <span>{uploadStatus}</span>
            </div>
          )}
        </section>

        {/* Evidence Dashboard */}
        <section className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2><FileCheck className="icon-title" /> Evidence Dashboard</h2>
            <button onClick={fetchEvidenceByCase} disabled={!caseId || !contract} className="secondary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Load Case Data
            </button>
          </div>

          {isLoadingList ? <p className="status-msg"><Loader2 className="spin" /> Loading...</p> : (
            <div className="table-responsive">
              {evidenceList.length > 0 ? (
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '1rem', color: '#cbd5e1' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>File Name</th>
                      <th style={{ padding: '10px' }}>Hash (SHA-256)</th>
                      <th style={{ padding: '10px' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidenceList.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px' }}>{item.id}</td>
                        <td style={{ padding: '10px' }}>{item.fileName}</td>
                        <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.fileHash.substring(0, 12)}...</td>
                        <td style={{ padding: '10px', fontSize: '0.85rem' }}>{item.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', color: '#64748b', marginTop: '1rem' }}>No evidence loaded for this case.</p>
              )}
            </div>
          )}
        </section>

        {/* Verify Section */}
        <section className="glass-card">
          <h2><Search className="icon-title" /> Verify Integrity</h2>
          <div className="form-group">
            <label>Digital Fingerprint (SHA-256)</label>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Paste SHA-256 Hash..."
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value)}
              />
              <button onClick={handleVerify} disabled={!contract} className="secondary-btn">
                <Search size={18} /> Verify
              </button>
            </div>
          </div>

          {verificationResult && (
            <div className={`result-box ${verificationResult.status === "Valid & On-Chain" ? "valid" : "invalid"}`}>
              <h3>
                {verificationResult.status === "Valid & On-Chain" ? <CheckCircle /> : <AlertCircle />}
                Status: {verificationResult.status}
              </h3>
              {verificationResult.status === "Valid & On-Chain" && reportData && (
                <button onClick={generateReport} className="report-btn">
                  <FileText size={18} /> Generate Section 65B Certificate
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Legal Report Overlay */}
      {showReport && reportData && (
        <div className="print-overlay" onClick={() => setShowReport(false)}>
          <div className="certificate">
            <h1>Certificate of Electronic Evidence (Section 65B)</h1>
            <p className="cert-meta">Generated via Private Consortium Blockchain</p>
            <hr style={{ margin: '20px 0', borderColor: '#000' }} />
            <div className="cert-body">
              <p><strong>I, Officer [ {account} ], certify that:</strong></p>
              <br />
              <p>The electronic record identified below was recorded on the secure Blockchain Ledger and has been maintained in a secure environment.</p>

              <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                <li><strong>Case Reference:</strong> {reportData.caseId}</li>
                <li><strong>File Name:</strong> {reportData.fileName || "N/A (Hash Verification Only)"}</li>
                <li><strong>Digital Fingerprint (SHA-256):</strong> <br /><code style={{ fontSize: '0.9rem' }}>{reportData.fileHash}</code></li>
                <li><strong>Timestamp of Record:</strong> {reportData.timestamp}</li>
              </ul>

              <p style={{ marginTop: '20px' }}>The computer output containing the information was produced by the computer during the period over which the computer was used regularly to store or process information for the purposes of any activities regularly carried on over that period by the person having lawful control over the use of the computer.</p>
            </div>
            <div className="cert-footer">
              <div className="signatures">
                <div>______________________<br />Authorized Signatory<br />(Officer)</div>
                <div>______________________<br />Date</div>
              </div>
            </div>
            <button className="no-print close-btn" onClick={(e) => { e.stopPropagation(); setShowReport(false) }}>Close Preview</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
