import React from 'react';

const LegalReport = ({ show, data, onClose, account }) => {
    if (!show || !data) return null;

    return (
        <div className="print-overlay" onClick={onClose}>
            <div className="certificate" onClick={(e) => e.stopPropagation()}>
                <h1>Certificate of Electronic Evidence (Section 65B)</h1>
                <p className="cert-meta">Generated via Private Consortium Blockchain</p>
                <hr style={{ margin: '20px 0', borderColor: '#000' }} />
                <div className="cert-body">
                    <p><strong>I, Officer [ {account} ], certify that:</strong></p>
                    <br />
                    <p>The electronic record identified below was recorded on the secure Blockchain Ledger and has been maintained in a secure environment.</p>

                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                        <li><strong>Case Reference:</strong> {data.caseId}</li>
                        <li><strong>File Name:</strong> {data.fileName || "N/A (Hash Verification Only)"}</li>
                        <li><strong>Digital Fingerprint (SHA-256):</strong> <br /><code style={{ fontSize: '0.9rem' }}>{data.fileHash}</code></li>
                        <li><strong>Timestamp of Record:</strong> {data.timestamp}</li>
                    </ul>

                    <p style={{ marginTop: '20px' }}>The computer output containing the information was produced by the computer during the period over which the computer was used regularly to store or process information for the purposes of any activities regularly carried on over that period by the person having lawful control over the use of the computer.</p>
                </div>
                <div className="cert-footer">
                    <div className="signatures">
                        <div>______________________<br />Authorized Signatory<br />(Officer)</div>
                        <div>______________________<br />Date</div>
                    </div>
                </div>
                <button className="no-print close-btn" onClick={(e) => { e.stopPropagation(); onClose() }}>Close Preview</button>
            </div>
        </div>
    );
};

export default LegalReport;
