import { AssetResponse, InheritanceRuleResponse, AuditLogEntry } from '@wid-platform/contracts';

export interface Beneficiary {
  id: string;
  name: string;
  email: string;
  relationship: string;
  status: 'verified' | 'pending' | 'revoked';
  allocation: number;
}

export interface UserSettings {
  email: string;
  name: string;
  mfaEnabled: boolean;
  mfaSecret: string;
  heartbeatIntervalDays: number;
  lastHeartbeat: string;
  status: 'active' | 'grace_period' | 'triggered';
  recoveryEmail: string;
  phone: string;
}

// Generate mock SHA-256 lookalikes
export const generateHash = () => {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
};

// Seed Data
const initialAssets: AssetResponse[] = [
  {
    id: 'asset-btc-key',
    name: 'Bitcoin Wallet Key (Ledger Nano)',
    description: 'Hardware wallet recovery passphrase for secondary cold storage vault (containing 4.25 BTC).',
    type: 'crypto',
    encryptedDetails: 'U2FsdGVkX19sF56p0n18Fm/5yB4wB5F9Z3h9X8wXw9W2J3nB8M+N9P+L8W9X4J5Z7H8W4K3N2Q1V5G6H7J==',
    ownerId: 'user-legacy-owner',
    isReleasable: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'asset-legal-will',
    name: 'Last Will and Testament (PDF)',
    description: 'Digital copy of the legalized family trust deed and assets division schedule signed in 2025.',
    type: 'document',
    encryptedDetails: 'U2FsdGVkX19mR3JkMTI4Njg5MJ4Q5N6G7H8J9K0L1M2N3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F==',
    ownerId: 'user-legacy-owner',
    isReleasable: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: 'asset-email-credentials',
    name: 'Google & Apple Primary Credentials',
    description: 'Master account details, 2FA bypass codes, and password vault recovery files.',
    type: 'social_media_account',
    encryptedDetails: 'U2FsdGVkX19jM3A0YjVjNmQ3ZThmOWE0YjFjMmQzZTRmNWY2ZzdoOGk5ajBrMWwybTNwNHE1cTZyN3M4dA==',
    ownerId: 'user-legacy-owner',
    isReleasable: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  }
];

const initialBeneficiaries: Beneficiary[] = [
  {
    id: 'heir-eleanor',
    name: 'Eleanor Vance',
    email: 'eleanor@family.com',
    relationship: 'Daughter',
    status: 'verified',
    allocation: 60,
  },
  {
    id: 'heir-charles',
    name: 'Charles Vance',
    email: 'charles@family.com',
    relationship: 'Son',
    status: 'verified',
    allocation: 40,
  }
];

const initialRules: InheritanceRuleResponse[] = [
  {
    id: 'rule-eleanor-btc',
    ownerId: 'user-legacy-owner',
    heirId: 'heir-eleanor',
    assetId: 'asset-btc-key',
    condition: 'Upon Dead Man Switch expiration (30 days inactivity)',
    delayDays: 0,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'rule-eleanor-will',
    ownerId: 'user-legacy-owner',
    heirId: 'heir-eleanor',
    assetId: 'asset-legal-will',
    condition: 'Upon Dead Man Switch expiration + 5 days grace period',
    delayDays: 5,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: 'rule-charles-will',
    ownerId: 'user-legacy-owner',
    heirId: 'heir-charles',
    assetId: 'asset-legal-will',
    condition: 'Upon Dead Man Switch expiration + 5 days grace period',
    delayDays: 5,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  }
];

const initialLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    action: 'USER_REGISTERED',
    actorType: 'user',
    actorId: 'user-legacy-owner',
    targetType: 'account',
    targetId: 'user-legacy-owner',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    cryptographicHash: 'f4b1c2a05e263d917f8a1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
    correlationId: 'corr-init-1',
    metadata: { browser: 'Chrome 124.0', ip: '192.168.1.45' }
  },
  {
    id: 'log-2',
    action: 'VAULT_CREATED',
    actorType: 'user',
    actorId: 'user-legacy-owner',
    targetType: 'vault',
    targetId: 'vault-legacy-owner',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    cryptographicHash: 'a5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
    correlationId: 'corr-init-1',
    metadata: { algo: 'AES-256-GCM', keyLength: 256 }
  },
  {
    id: 'log-3',
    action: 'HEARTBEAT_RECORDED',
    actorType: 'system',
    actorId: 'switch-daemon',
    targetType: 'switch',
    targetId: 'user-legacy-owner',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    cryptographicHash: '3f4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    correlationId: 'corr-hb-last',
    metadata: { triggerType: 'manual_dashboard_ping' }
  }
];

const initialSettings: UserSettings = {
  email: 'owner@legacy.com',
  name: 'Legacy Owner',
  mfaEnabled: true,
  mfaSecret: 'JBSWY3DPEHPK3PXP', // Mock Base32 Secret
  heartbeatIntervalDays: 30,
  lastHeartbeat: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  status: 'active',
  recoveryEmail: 'recovery-guardian@legacy.com',
  phone: '+1 (555) 902-1134'
};

// Storage Helpers
export const mockDb = {
  init: () => {
    if (!localStorage.getItem('wid_assets')) {
      localStorage.setItem('wid_assets', JSON.stringify(initialAssets));
    }
    if (!localStorage.getItem('wid_beneficiaries')) {
      localStorage.setItem('wid_beneficiaries', JSON.stringify(initialBeneficiaries));
    }
    if (!localStorage.getItem('wid_rules')) {
      localStorage.setItem('wid_rules', JSON.stringify(initialRules));
    }
    if (!localStorage.getItem('wid_logs')) {
      localStorage.setItem('wid_logs', JSON.stringify(initialLogs));
    }
    if (!localStorage.getItem('wid_settings')) {
      localStorage.setItem('wid_settings', JSON.stringify(initialSettings));
    }
  },

  getAssets: (): AssetResponse[] => {
    mockDb.init();
    return JSON.parse(localStorage.getItem('wid_assets') || '[]');
  },

  saveAssets: (assets: AssetResponse[]) => {
    localStorage.setItem('wid_assets', JSON.stringify(assets));
  },

  addAsset: (asset: Omit<AssetResponse, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) => {
    const assets = mockDb.getAssets();
    const newAsset: AssetResponse = {
      ...asset,
      id: 'asset-' + Math.random().toString(36).substr(2, 9),
      ownerId: 'user-legacy-owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    assets.push(newAsset);
    mockDb.saveAssets(assets);
    mockDb.addLog('ASSET_ADDED', 'asset', newAsset.id, { name: newAsset.name, type: newAsset.type });
    return newAsset;
  },

  deleteAsset: (id: string) => {
    const assets = mockDb.getAssets();
    const assetToDelete = assets.find(a => a.id === id);
    const filtered = assets.filter(a => a.id !== id);
    mockDb.saveAssets(filtered);
    
    // Also cleanup linked rules
    const rules = mockDb.getRules();
    const filteredRules = rules.filter(r => r.assetId !== id);
    mockDb.saveRules(filteredRules);

    if (assetToDelete) {
      mockDb.addLog('ASSET_DELETED', 'asset', id, { name: assetToDelete.name });
    }
  },

  getRules: (): InheritanceRuleResponse[] => {
    mockDb.init();
    return JSON.parse(localStorage.getItem('wid_rules') || '[]');
  },

  saveRules: (rules: InheritanceRuleResponse[]) => {
    localStorage.setItem('wid_rules', JSON.stringify(rules));
  },

  addRule: (rule: Omit<InheritanceRuleResponse, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) => {
    const rules = mockDb.getRules();
    const newRule: InheritanceRuleResponse = {
      ...rule,
      id: 'rule-' + Math.random().toString(36).substr(2, 9),
      ownerId: 'user-legacy-owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    rules.push(newRule);
    mockDb.saveRules(rules);
    mockDb.addLog('RULE_CREATED', 'rule', newRule.id, { condition: newRule.condition, heirId: newRule.heirId });
    return newRule;
  },

  deleteRule: (id: string) => {
    const rules = mockDb.getRules();
    const filtered = rules.filter(r => r.id !== id);
    mockDb.saveRules(filtered);
    mockDb.addLog('RULE_DELETED', 'rule', id);
  },

  getBeneficiaries: (): Beneficiary[] => {
    mockDb.init();
    return JSON.parse(localStorage.getItem('wid_beneficiaries') || '[]');
  },

  saveBeneficiaries: (heirs: Beneficiary[]) => {
    localStorage.setItem('wid_beneficiaries', JSON.stringify(heirs));
  },

  addBeneficiary: (heir: Omit<Beneficiary, 'id' | 'status'>) => {
    const heirs = mockDb.getBeneficiaries();
    const newHeir: Beneficiary = {
      ...heir,
      id: 'heir-' + Math.random().toString(36).substr(2, 9),
      status: 'verified'
    };
    heirs.push(newHeir);
    mockDb.saveBeneficiaries(heirs);
    mockDb.addLog('BENEFICIARY_ADDED', 'beneficiary', newHeir.id, { name: newHeir.name, email: newHeir.email });
    return newHeir;
  },

  deleteBeneficiary: (id: string) => {
    const heirs = mockDb.getBeneficiaries();
    const filtered = heirs.filter(h => h.id !== id);
    mockDb.saveBeneficiaries(filtered);

    // Update rules linked to this heir
    const rules = mockDb.getRules();
    const filteredRules = rules.filter(r => r.heirId !== id);
    mockDb.saveRules(filteredRules);
    
    mockDb.addLog('BENEFICIARY_DELETED', 'beneficiary', id);
  },

  getLogs: (): AuditLogEntry[] => {
    mockDb.init();
    return JSON.parse(localStorage.getItem('wid_logs') || '[]');
  },

  addLog: (action: string, targetType: string, targetId: string, metadata: Record<string, any> = {}) => {
    const logs = mockDb.getLogs();
    const newLog: AuditLogEntry = {
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      action,
      actorType: 'user',
      actorId: 'user-legacy-owner',
      targetType,
      targetId,
      timestamp: new Date().toISOString(),
      cryptographicHash: generateHash(),
      metadata
    };
    logs.unshift(newLog); // Prepend to show newest first
    localStorage.setItem('wid_logs', JSON.stringify(logs.slice(0, 100))); // Keep last 100
    return newLog;
  },

  getSettings: (): UserSettings => {
    mockDb.init();
    return JSON.parse(localStorage.getItem('wid_settings') || '{}');
  },

  saveSettings: (settings: UserSettings) => {
    localStorage.setItem('wid_settings', JSON.stringify(settings));
  },

  updateSettings: (updates: Partial<UserSettings>) => {
    const current = mockDb.getSettings();
    const updated = { ...current, ...updates };
    mockDb.saveSettings(updated);
    mockDb.addLog('SETTINGS_UPDATED', 'settings', 'user-legacy-owner', updates);
    return updated;
  },

  triggerHeartbeat: () => {
    const now = new Date().toISOString();
    const updated = mockDb.updateSettings({ lastHeartbeat: now });
    mockDb.addLog('HEARTBEAT_RECORDED', 'switch', 'user-legacy-owner', { source: 'dashboard_pulse' });
    return updated;
  }
};
