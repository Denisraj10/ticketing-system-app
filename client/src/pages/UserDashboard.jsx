import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { TicketCard } from '../components/TicketCard';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ open: 0, closed: 0, onHold: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = filter !== 'All' ? { status: filter } : {};
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

  const StatCard = ({ label, value, color }) => (
    <div className={`${color} rounded-xl p-6 shadow-sm border border-gray-500`}>
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">Manage and track your support tickets</p>
          </div>
          <button
            onClick={() => navigate('/create-ticket')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            + Create Ticket
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Tickets" value={stats.total} color="bg-blue-300" />
          <StatCard label="Open" value={stats.open} color="bg-cyan-300" />
          <StatCard label="Closed" value={stats.closed} color="bg-green-300" />
          <StatCard label="On Hold" value={stats.onHold} color="bg-red-300" />
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center space-x-4">
          <span className="text-sm font-semibold text-gray-700">Filter by status:</span>
          <div className="flex space-x-3">
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

        {/* Tickets Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onClick={() => navigate(`/ticket/${ticket._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-600 text-lg">No tickets found</p>
            <button
              onClick={() => navigate('/create-ticket')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Create your first ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
