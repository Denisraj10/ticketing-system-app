import React from 'react';
import { StatusBadge } from './StatusBadge';

export const TicketTable = ({ tickets, onStatusChange, onDelete, isManager }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Due Date</th>
              {isManager && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ticket.ticketName}</p>
                    <p className="text-xs text-gray-500">#{ticket._id.substring(0, 8)}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{ticket.contactName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{ticket.email}</td>
                <td className="px-6 py-4">
                  {isManager ? (
                    <select
                      value={ticket.status}
                      onChange={(e) => onStatusChange(ticket._id, e.target.value)}
                      className="text-sm px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  ) : (
                    <StatusBadge status={ticket.status} />
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(ticket.dueDate).toLocaleDateString()}
                </td>
                {isManager && (
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDelete(ticket._id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
