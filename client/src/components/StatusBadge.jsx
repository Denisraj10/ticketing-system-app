import React from 'react';
import { useAuth } from '../context/AuthContext';

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    Open: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Open' },
    Closed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Closed' },
    'On Hold': { bg: 'bg-red-100', text: 'text-red-800', label: 'On Hold' },
  };

  const config = statusConfig[status] || statusConfig.Open;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
