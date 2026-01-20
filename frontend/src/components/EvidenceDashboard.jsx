import React, { useState } from 'react';
import { FileCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EvidenceDashboard = ({ contract, evidenceList, setEvidenceList, onViewReport }) => {
    const [isLoading, setIsLoading] = useState(false);

    const fetchEvidence = async () => {
        if (!contract) return toast.error("Connect wallet to load data");
        setIsLoading(true);

        try {
            console.log("Fetching ALL evidence history...");
            const records = await contract.getAllEvidence();

            if (!records || records.length === 0) {
                setEvidenceList([]);
                toast("No evidence history found.");
                return;
            }

            const formattedRecords = records.map(r => ({
                id: r.id.toString(),
                caseId: r.caseId,
                fileHash: r.fileHash,
                fileName: r.fileName,
                uploader: r.uploader,
                timestamp: new Date(Number(r.timestamp) * 1000).toLocaleString()
            }));

            formattedRecords.sort((a, b) => Number(b.id) - Number(a.id));
            setEvidenceList(formattedRecords);
            toast.success("Evidence history loaded");
        } catch (error) {
            console.error("Fetch failed", error);
            toast.error("Failed to fetch evidence");
            setEvidenceList([]); // Fallback
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2><FileCheck className="icon-title" /> Evidence Dashboard</h2>
                <button onClick={fetchEvidence} disabled={!contract} className="secondary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Load All History
                </button>
            </div>

            {isLoading ? <p className="status-msg"><Loader2 className="spin" /> Loading...</p> : (
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
                                    <tr
                                        key={index}
                                        style={{ borderBottom: '1px solid #1e293b', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onClick={() => onViewReport(item)}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        title="Click to view Section 65B Certificate"
                                    >
                                        <td style={{ padding: '10px' }}>{item.id}</td>
                                        <td style={{ padding: '10px' }}>{item.fileName}</td>
                                        <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.fileHash.substring(0, 12)}...</td>
                                        <td style={{ padding: '10px', fontSize: '0.85rem' }}>{item.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '1rem' }}>No evidence loaded.</p>
                    )}
                </div>
            )}
        </section>
    );
};

export default EvidenceDashboard;
