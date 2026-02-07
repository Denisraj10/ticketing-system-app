import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { TicketTable } from '../components/TicketTable';
import apiClient from '../api/axios';

export const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ open: 0, closed: 0, onHold: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [search, filter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'All') params.status = filter;
      if (search) params.search = search;

      const response = await apiClient.get('/tickets', { params });
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/tickets/count');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await apiClient.patch(`/tickets/${ticketId}/status`, { status: newStatus });
      setTickets(
        tickets.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update ticket status');
    }
  };

  const handleDelete = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await apiClient.delete(`/tickets/${ticketId}`);
        setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
        fetchStats();
      } catch (error) {
        console.error('Error deleting ticket:', error);
        alert('Failed to delete ticket');
      }
    }
  };

  const StatCard = ({ label, value, color }) => (
    <div className={`${color} rounded-xl p-6 shadow-sm border border-gray-100`}>
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h2>
          <p className="text-gray-600">View and manage all support tickets</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Tickets" value={stats.total} color="bg-blue-300" />
          <StatCard label="Open" value={stats.open} color="bg-cyan-300" />
          <StatCard label="Closed" value={stats.closed} color="bg-green-300" />
          <StatCard label="On Hold" value={stats.onHold} color="bg-red-300" />
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ticket name, contact, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <div className="flex space-x-2">
              {['All', 'Open', 'Closed', 'On Hold'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : tickets.length > 0 ? (
          <TicketTable
            tickets={tickets}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            isManager={true}
          />
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-600 text-lg">No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
