
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { AuditLogEntry, ListAuditLogsResponseSchema, GetAuditLogRequestSchema } from '@wid-platform/contracts';

const AuditPage = () => {
  const { data, isLoading, error } = useQuery<AuditLogEntry[]>({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      // For MVP, we'll fetch all without specific filters from GetAuditLogRequestSchema
      const response = await api.get('/audit');
      return ListAuditLogsResponseSchema.parse(response.data); // Validate response with Zod
    },
  });

  if (isLoading) return <div>Loading audit logs...</div>;
  if (error) return <div>Error loading audit logs: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Audit Log Timeline</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {data?.map((log) => (
            <li key={log.id} className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
                <p className="ml-2 inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                  {log.action}
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-900">
                <p><strong>Actor:</strong> {log.actorType} {log.actorId ? `(${log.actorId})` : ''}</p>
                <p><strong>Target:</strong> {log.targetType} {log.targetId ? `(${log.targetId})` : ''}</p>
                {log.correlationId && <p><strong>Correlation ID:</strong> {log.correlationId}</p>}
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className="mt-1">
                    <strong>Metadata:</strong>
                    <pre className="mt-1 p-2 bg-gray-50 rounded-md text-xs overflow-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Hash: <span className="font-mono text-gray-700">{log.cryptographicHash}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuditPage;
