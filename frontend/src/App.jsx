import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import './App.css'
import EvidenceAbi from './contracts/Evidence.json'
import EvidenceAddress from './contracts/Evidence-address.json'

// Components
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import EvidenceDashboard from './components/EvidenceDashboard';
import VerificationSection from './components/VerificationSection';
import LegalReport from './components/LegalReport';
import JudgeDashboard from './components/JudgeDashboard';
import AdminPanel from './components/AdminPanel';

function App() {
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [role, setRole] = useState('none')

  // Shared State
  const [evidenceList, setEvidenceList] = useState([])
  const [verifyHash, setVerifyHash] = useState('')

  // Report State
  const [showReport, setShowReport] = useState(false)
  const [reportData, setReportData] = useState(null)

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Re-fetch role when account changes
          if (contract) {
            contract.getRole(accounts[0]).then(setRole).catch(console.error);
          }
        } else {
          setAccount(null);
          setRole('none');
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, [contract]);

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

        // Fetch role from contract
        const userRole = await evidenceContract.getRole(accounts[0]);
        setRole(userRole);
        toast.success(`Connected as ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`);

      } catch (error) {
        console.error("Connection failed", error)
        toast.error("Failed to connect wallet.");
      }
    } else {
      toast.error("Please install Metamask!");
    }
  }

  const handleUploadSuccess = (newRecord, hash) => {
    setEvidenceList(prev => [newRecord, ...prev]);
    setVerifyHash(hash);
  };

  const handleGenerateReport = (hash) => {
    const foundLocal = evidenceList.find(e => e.fileHash === hash);
    if (foundLocal) {
      setReportData(foundLocal);
    } else {
      setReportData({
        caseId: "Unknown (Query by Case ID for details)",
        fileHash: hash,
        uploader: "Verified On-Chain",
        timestamp: "Verified On-Chain"
      });
    }
    setShowReport(true);
    setTimeout(() => window.print(), 500);
  };

  const handleViewReport = (item) => {
    setReportData(item);
    setShowReport(true);
  };

  // Determine if current user can upload (admin or officer)
  const canUpload = role === 'admin' || role === 'officer';
  const isJudge = role === 'judge';
  const isAdmin = role === 'admin';

  return (
    <div className="container">
      <Toaster position="top-center" reverseOrder={false} />

      <Header account={account} connectWallet={connectWallet} role={role} onSwitchAccount={connectWallet} />

      <main>
        {/* Admin sees Admin Panel first */}
        {isAdmin && <AdminPanel contract={contract} />}

        {/* Judge sees JudgeDashboard + Evidence Dashboard */}
        {isJudge ? (
          <>
            <JudgeDashboard
              contract={contract}
              account={account}
              onViewReport={handleViewReport}
            />
            <EvidenceDashboard
              contract={contract}
              evidenceList={evidenceList}
              setEvidenceList={setEvidenceList}
              onViewReport={handleViewReport}
            />
            <VerificationSection
              contract={contract}
              initialHash={verifyHash}
              onGenerateReport={handleGenerateReport}
            />
          </>
        ) : (
          <>
            {/* Admin and Officer see Upload Form */}
            {canUpload && (
              <UploadForm
                contract={contract}
                account={account}
                onUploadSuccess={handleUploadSuccess}
              />
            )}

            <EvidenceDashboard
              contract={contract}
              evidenceList={evidenceList}
              setEvidenceList={setEvidenceList}
              onViewReport={handleViewReport}
            />

            <VerificationSection
              contract={contract}
              initialHash={verifyHash}
              onGenerateReport={handleGenerateReport}
            />
          </>
        )}
      </main>

      <LegalReport
        show={showReport}
        data={reportData}
        onClose={() => setShowReport(false)}
        account={account}
      />
    </div>
  )
}

export default App
