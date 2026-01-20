import React, { useState } from 'react';
import { UserPlus, Gavel, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = ({ contract }) => {
    const [officerAddress, setOfficerAddress] = useState('');
    const [judgeAddress, setJudgeAddress] = useState('');
    const [isAddingOfficer, setIsAddingOfficer] = useState(false);
    const [isAddingJudge, setIsAddingJudge] = useState(false);

    const handleAddOfficer = async () => {
        if (!contract || !officerAddress) return toast.error("Enter a valid address");
        setIsAddingOfficer(true);
        try {
            const tx = await contract.addOfficer(officerAddress);
            await tx.wait();
            toast.success("Officer added successfully!");
            setOfficerAddress('');
        } catch (error) {
            console.error(error);
            toast.error("Failed: " + (error.reason || error.message));
        } finally {
            setIsAddingOfficer(false);
        }
    };

    const handleAddJudge = async () => {
        if (!contract || !judgeAddress) return toast.error("Enter a valid address");
        setIsAddingJudge(true);
        try {
            const tx = await contract.addJudge(judgeAddress);
            await tx.wait();
            toast.success("Judge added successfully!");
            setJudgeAddress('');
        } catch (error) {
            console.error(error);
            toast.error("Failed: " + (error.reason || error.message));
        } finally {
            setIsAddingJudge(false);
        }
    };

    return (
        <section className="glass-card">
            <h2><ShieldCheck className="icon-title" /> Admin Panel</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Add new Officers and Judges to the system.
            </p>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Add Officer */}
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                        <UserPlus size={18} style={{ color: '#3b82f6' }} /> Add Officer
                    </label>
                    <input
                        type="text"
                        placeholder="0x... Officer Address"
                        value={officerAddress}
                        onChange={(e) => setOfficerAddress(e.target.value)}
                        style={{ marginBottom: '0.75rem' }}
                    />
                    <button
                        onClick={handleAddOfficer}
                        disabled={isAddingOfficer}
                        className="secondary-btn"
                        style={{ width: '100%', justifyContent: 'center', borderColor: '#3b82f6', color: '#3b82f6' }}
                    >
                        {isAddingOfficer ? <Loader2 className="spin" size={16} /> : <UserPlus size={16} />}
                        {isAddingOfficer ? ' Adding...' : ' Add Officer'}
                    </button>
                </div>

                {/* Add Judge */}
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                        <Gavel size={18} style={{ color: '#10b981' }} /> Add Judge
                    </label>
                    <input
                        type="text"
                        placeholder="0x... Judge Address"
                        value={judgeAddress}
                        onChange={(e) => setJudgeAddress(e.target.value)}
                        style={{ marginBottom: '0.75rem' }}
                    />
                    <button
                        onClick={handleAddJudge}
                        disabled={isAddingJudge}
                        className="secondary-btn"
                        style={{ width: '100%', justifyContent: 'center', borderColor: '#10b981', color: '#10b981' }}
                    >
                        {isAddingJudge ? <Loader2 className="spin" size={16} /> : <Gavel size={16} />}
                        {isAddingJudge ? ' Adding...' : ' Add Judge'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AdminPanel;
