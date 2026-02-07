import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { StatusBadge } from '../components/StatusBadge';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/tickets/${id}`);
      setTicket(response.data.ticket);
      setStatus(response.data.ticket.status);
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await apiClient.patch(`/tickets/${id}/status`, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update ticket status');
    }
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      setSendingMessage(true);
      await apiClient.post(`/tickets/${id}/messages`, {
        text: messageText,
        sender: user.name,
      });
      setMessageText('');
      fetchTicket();
    } catch (error) {
      console.error('Error adding message:', error);
      alert('Failed to add message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 text-lg">Ticket not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-6 flex items-center"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.ticketName}</h1>
            <p className="text-gray-600">Ticket #{ticket._id.substring(0, 12)}</p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Contact Name</p>
                    <p className="font-medium text-gray-900">{ticket.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{ticket.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{ticket.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Due Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(ticket.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {ticket.messages && ticket.messages.length > 0 ? (
                  ticket.messages.map((message) => (
                    <div key={message._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-gray-900">{message.sender}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-gray-700">{message.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No messages yet</p>
                )}
              </div>

              {/* Add Message */}
              <form onSubmit={handleAddMessage} className="border-t border-gray-200 pt-4">
                <div className="flex gap-3">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    rows="3"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingMessage || !messageText.trim()}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            {user?.role === 'manager' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Status</h2>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            )}

            {/* Created By Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Created By</h3>
              <p className="font-medium text-gray-900">{ticket.createdBy?.name}</p>
              <p className="text-sm text-gray-600">{ticket.createdBy?.email}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Assigned To Card */}
            {ticket.assignedTo && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Assigned To</h3>
                <p className="font-medium text-gray-900">{ticket.assignedTo?.name}</p>
                <p className="text-sm text-gray-600">{ticket.assignedTo?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
