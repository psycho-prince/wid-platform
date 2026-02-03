import React, { useState } from 'react';
import { InheritanceRuleResponse } from '@wid-platform/contracts';

// Mock data for inheritance rules
const mockRules: InheritanceRuleResponse[] = [
  {
    id: 'rule-1-abc',
    ownerId: 'user-id-123',
    heirId: 'heir-id-456',
    assetId: null,
    condition: 'upon death verification',
    delayDays: 30,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-2-def',
    ownerId: 'user-id-123',
    heirId: 'heir-id-789',
    assetId: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210', // Linked to a specific asset
    condition: 'upon death verification',
    delayDays: 0,
    status: 'pending_execution', // Example of a rule waiting for execution
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-3-ghi',
    ownerId: 'user-id-123',
    heirId: 'heir-id-012',
    assetId: null,
    condition: 'after 60 days of death',
    delayDays: 60,
    status: 'executed', // Example of an executed rule
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const InheritanceRulesPage = () => {
  const [rules, setRules] = useState<InheritanceRuleResponse[]>(mockRules);

  const handleDeleteRule = (ruleId: string) => {
    if (window.confirm('Are you sure you want to irrevocably delete this inheritance rule? This action cannot be undone.')) {
      // In a real application, you would call an API here to delete the rule
      console.log(`Deleting rule with ID: ${ruleId}`);
      setRules(rules.filter(rule => rule.id !== ruleId));
      alert('Inheritance rule deleted successfully.');
    } else {
      alert('Inheritance rule deletion cancelled.');
    }
  };

  const getStatusColor = (status: InheritanceRuleResponse['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending_execution': return 'bg-yellow-100 text-yellow-800';
      case 'executed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Inheritance Rules</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Defined Rules</h2>
        {rules.length === 0 ? (
          <p className="text-gray-600">No inheritance rules defined yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Rule ID: {rule.id.substring(0, 8)}...</h3>
                <p className="text-gray-600 text-sm mb-2"><strong>Heir:</strong> {rule.heirId.substring(0, 8)}...</p>
                {rule.assetId && <p className="text-gray-600 text-sm mb-2"><strong>Asset:</strong> {rule.assetId.substring(0, 8)}...</p>}
                <p className="text-gray-600 text-sm mb-2"><strong>Condition:</strong> {rule.condition}</p>
                {rule.delayDays !== null && <p className="text-gray-600 text-sm mb-4"><strong>Delay:</strong> {rule.delayDays} days</p>}
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                    {rule.status.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="ml-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete Rule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Create New Rule (Placeholder)</h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-gray-600 mb-4">
            Rule builder form will be implemented here to define new inheritance rules.
          </p>
          <button className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Add New Rule
          </button>
        </div>
      </div>
    </div>
  );
};

export default InheritanceRulesPage;