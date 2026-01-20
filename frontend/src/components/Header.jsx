import React from 'react';
import { Shield, Wallet, User, Gavel, ShieldCheck, RefreshCw } from 'lucide-react';

const roleConfig = {
    admin: { label: 'Admin', color: '#f59e0b', icon: ShieldCheck },
    officer: { label: 'Officer', color: '#3b82f6', icon: User },
    judge: { label: 'Judge', color: '#10b981', icon: Gavel },
    none: { label: 'Guest', color: '#64748b', icon: User }
};

const Header = ({ account, connectWallet, role, onSwitchAccount }) => {
    const roleInfo = roleConfig[role] || roleConfig.none;
    const RoleIcon = roleInfo.icon;

    const handleSwitchAccount = async () => {
        if (window.ethereum) {
            try {
                // This triggers MetaMask to show the account picker
                await window.ethereum.request({
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }]
                });
                // After user selects, we need to refresh the connection
                if (onSwitchAccount) onSwitchAccount();
            } catch (error) {
                console.error("Account switch cancelled or failed", error);
            }
        }
    };

    return (
        <header>
            <h1>
                <Shield className="icon-logo" size={32} /> Digital Evidence Vault
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {account && role && role !== 'none' && (
                    <div
                        className="role-badge"
                        style={{
                            background: `${roleInfo.color}20`,
                            border: `1px solid ${roleInfo.color}`,
                            color: roleInfo.color,
                            padding: '0.4rem 0.8rem',
                            borderRadius: '50px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <RoleIcon size={16} /> {roleInfo.label}
                    </div>
                )}
                {!account ? (
                    <button onClick={connectWallet} className="primary-btn">
                        <Wallet size={18} /> Connect Wallet
                    </button>
                ) : (
                    <div
                        className="status"
                        onClick={handleSwitchAccount}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        title="Click to switch account"
                    >
                        <span className="live-indicator">●</span>
                        {account.substring(0, 6)}...{account.substring(38)}
                        <RefreshCw size={14} style={{ opacity: 0.7 }} />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
