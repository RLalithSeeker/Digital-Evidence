import React, { useState, useEffect } from 'react';
import { Gavel, Loader2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const JudgeDashboard = ({ contract, account, onViewReport }) => {
    const [evidenceList, setEvidenceList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [approving, setApproving] = useState(null);

    const fetchEvidence = async () => {
        if (!contract) return;
        setIsLoading(true);
        try {
            const records = await contract.getAllEvidence();
            if (!records || records.length === 0) {
                setEvidenceList([]);
                return;
            }
            const formattedRecords = records.map(r => ({
                id: r.id.toString(),
                caseId: r.caseId,
                fileHash: r.fileHash,
                fileName: r.fileName,
                uploader: r.uploader,
                timestamp: new Date(Number(r.timestamp) * 1000).toLocaleString(),
                isApproved: r.isApproved,
                approvedBy: r.approvedBy,
                approvedAt: r.approvedAt > 0 ? new Date(Number(r.approvedAt) * 1000).toLocaleString() : null
            }));
            formattedRecords.sort((a, b) => Number(b.id) - Number(a.id));
            setEvidenceList(formattedRecords);
        } catch (error) {
            console.error("Fetch failed", error);
            toast.error("Failed to load evidence");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (contract) fetchEvidence();
    }, [contract]);

    const handleApprove = async (fileHash) => {
        if (!contract) return;
        setApproving(fileHash);
        try {
            const tx = await contract.approveEvidence(fileHash);
            await tx.wait();
            toast.success("Evidence Approved!");
            fetchEvidence(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error("Approval failed: " + (error.reason || error.message));
        } finally {
            setApproving(null);
        }
    };

    return (
        <section className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2><Gavel className="icon-title" /> Judge Dashboard</h2>
                <button onClick={fetchEvidence} disabled={!contract} className="secondary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Refresh
                </button>
            </div>

            {isLoading ? <p className="status-msg"><Loader2 className="spin" /> Loading...</p> : (
                <div className="table-responsive">
                    {evidenceList.length > 0 ? (
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '1rem', color: '#cbd5e1' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #334155' }}>
                                    <th style={{ padding: '10px' }}>ID</th>
                                    <th style={{ padding: '10px' }}>Case ID</th>
                                    <th style={{ padding: '10px' }}>File Name</th>
                                    <th style={{ padding: '10px' }}>Hash</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                    <th style={{ padding: '10px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evidenceList.map((item, index) => (
                                    <tr
                                        key={index}
                                        style={{ borderBottom: '1px solid #1e293b' }}
                                    >
                                        <td style={{ padding: '10px' }}>{item.id}</td>
                                        <td style={{ padding: '10px' }}>{item.caseId}</td>
                                        <td style={{ padding: '10px' }}>{item.fileName}</td>
                                        <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.fileHash.substring(0, 10)}...</td>
                                        <td style={{ padding: '10px' }}>
                                            {item.isApproved ? (
                                                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <CheckCircle size={16} /> Approved
                                                </span>
                                            ) : (
                                                <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <Clock size={16} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {item.isApproved ? (
                                                <button
                                                    className="secondary-btn"
                                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                                    onClick={() => onViewReport(item)}
                                                >
                                                    View Report
                                                </button>
                                            ) : (
                                                <button
                                                    className="action-btn"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
                                                    onClick={() => handleApprove(item.fileHash)}
                                                    disabled={approving === item.fileHash}
                                                >
                                                    {approving === item.fileHash ? <Loader2 className="spin" size={14} /> : <Gavel size={14} />}
                                                    {approving === item.fileHash ? ' Approving...' : ' Approve'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '1rem' }}>No evidence to review.</p>
                    )}
                </div>
            )}
        </section>
    );
};

export default JudgeDashboard;
