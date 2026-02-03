import React, { useState } from 'react';
import { AssetResponse } from '@wid-platform/contracts';

// Mock data for assets
const mockAssets: AssetResponse[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: 'Bitcoin Wallet Key',
    description: 'Private key for BTC wallet on Ledger Nano X',
    type: 'crypto',
    encryptedDetails: 'ENCRYPTED_BTC_DETAILS_HASH',
    ownerId: 'user-id-123',
    isReleasable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210',
    name: 'Last Will and Testament',
    description: 'Legal document stored securely',
    type: 'document',
    encryptedDetails: 'ENCRYPTED_WILL_DETAILS_HASH',
    ownerId: 'user-id-123',
    isReleasable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    name: 'Facebook Account Access',
    description: 'Login credentials for Facebook',
    type: 'social_media_account',
    encryptedDetails: 'ENCRYPTED_FACEBOOK_DETAILS_HASH',
    ownerId: 'user-id-123',
    isReleasable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


const AssetVaultPage = () => {
  const [assets, setAssets] = useState<AssetResponse[]>(mockAssets);

  const handleDeleteAsset = (assetId: string) => {
    if (window.confirm('Are you sure you want to irrevocably delete this asset? This action cannot be undone.')) {
      // In a real application, you would call an API here to delete the asset
      console.log(`Deleting asset with ID: ${assetId}`);
      setAssets(assets.filter(asset => asset.id !== assetId));
      alert('Asset deleted successfully.');
    } else {
      alert('Asset deletion cancelled.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Asset Vault</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Digital Assets</h2>
        {assets.length === 0 ? (
          <p className="text-gray-600">No assets found in your vault.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{asset.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{asset.description || 'No description provided.'}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    asset.isReleasable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {asset.isReleasable ? 'Releasable' : 'Pending Release'}
                  </span>
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="ml-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete Asset
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Upload New Asset (Placeholder)</h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-gray-600 mb-4">
            Upload functionality is a placeholder. Real cryptographic storage integration coming in v1.
          </p>
          <button className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetVaultPage;