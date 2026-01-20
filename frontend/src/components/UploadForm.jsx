import React, { useState } from 'react';
import { UploadCloud, Loader2, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadForm = ({ contract, account, onUploadSuccess }) => {
    const [caseId, setCaseId] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const generateHash = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!contract) return toast.error("Please connect wallet first!");
        if (!file || !caseId) return toast.error("Please fill all fields!");

        try {
            setIsUploading(true);
            setUploadStatus("Hashing File (SHA-256)...");

            const fileHash = await generateHash(file);
            console.log("Generated SHA-256 Hash:", fileHash);

            setUploadStatus("Awaiting Blockchain Signature...");
            const tx = await contract.uploadEvidence(caseId, fileHash, file.name);

            setUploadStatus("Mining Transaction...");
            await tx.wait();

            setUploadStatus("Success!");
            toast.success("Evidence Secured On-Chain!");

            onUploadSuccess({
                id: Date.now(),
                caseId,
                fileName: file.name,
                fileHash,
                uploader: account,
                timestamp: new Date().toLocaleString()
            }, fileHash);

            setCaseId('');
            setFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error(error);
            const errMsg = error.reason || error.message;
            setUploadStatus("Failed");
            toast.error("Upload Failed: " + errMsg);
        } finally {
            setIsUploading(false);
            setTimeout(() => setUploadStatus(''), 5000);
        }
    };

    return (
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
                    {previewUrl && (
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <img src={previewUrl} alt="Evidence Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #334155' }} />
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>*Local Preview (File is not uploaded to server)</p>
                        </div>
                    )}
                </div>
                <button type="submit" disabled={!contract || isUploading} className="action-btn">
                    {isUploading ? <Loader2 className="spin" /> : <Shield size={20} />}
                    {isUploading ? " Processing..." : (contract ? " Secure Evidence On-Chain" : " Connect Wallet to Upload")}
                </button>
            </form>
            {uploadStatus && (
                <div className="status-msg">
                    {isUploading ? <Loader2 className="spin" size={16} /> : <CheckCircle size={16} />}
                    <span>{uploadStatus}</span>
                </div>
            )}
        </section>
    );
};

export default UploadForm;
