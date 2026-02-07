import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './StatusBadge';

export const TicketCard = ({ ticket, onClick }) => {
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(ticket.dueDate);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100 hover:border-blue-300"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{ticket.ticketName}</h3>
          <p className="text-sm text-gray-600">#{ticket._id.substring(0, 8)}</p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{ticket.description}</p>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <span className="font-medium text-gray-700 mr-2">Contact:</span>
          {ticket.contactName}
        </div>
        <div className="flex items-center text-gray-600">
          <span className="font-medium text-gray-700 mr-2">Email:</span>
          {ticket.email}
        </div>
        <div className="flex items-center text-gray-600">
          <span className="font-medium text-gray-700 mr-2">Phone:</span>
          {ticket.phone}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className={`text-xs font-medium ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 3 ? 'text-orange-600' : 'text-gray-600'}`}>
          {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days left`}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default TicketCard;
