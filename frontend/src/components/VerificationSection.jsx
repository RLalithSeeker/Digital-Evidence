import React, { useState } from 'react';
import { Search, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const VerificationSection = ({ contract, onGenerateReport, initialHash }) => {
    const [verifyHash, setVerifyHash] = useState(initialHash || '');
    const [verificationResult, setVerificationResult] = useState(null);

    // Update local state if initialHash prop changes (optional / useEffect)
    React.useEffect(() => {
        if (initialHash) setVerifyHash(initialHash);
    }, [initialHash]);

    const handleVerify = async () => {
        if (!contract || !verifyHash) return;

        try {
            const isValid = await contract.verifyIntegrity(verifyHash);

            if (isValid) {
                setVerificationResult({
                    status: "Valid & On-Chain",
                    isValid: true
                });
                toast.success("Hash Verified on Blockchain!");
            } else {
                setVerificationResult({ status: "Not Found / Invalid", isValid: false });
                toast.error("Hash not found on-chain!");
            }
        } catch (error) {
            console.error(error);
            setVerificationResult({ status: "Error Verifying", isValid: false });
            toast.error("Verification Error");
        }
    };

    return (
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
                <div className={`result-box ${verificationResult.isValid ? "valid" : "invalid"}`}>
                    <h3>
                        {verificationResult.isValid ? <CheckCircle /> : <AlertCircle />}
                        Status: {verificationResult.status}
                    </h3>
                    {verificationResult.isValid && onGenerateReport && (
                        <button onClick={() => onGenerateReport(verifyHash)} className="report-btn">
                            <FileText size={18} /> Generate Section 65B Certificate
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default VerificationSection;
