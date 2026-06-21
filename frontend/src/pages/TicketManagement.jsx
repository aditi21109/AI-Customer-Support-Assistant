import React, { useState, useEffect } from 'react';
import TicketCard from '../components/TicketCard';
import { ticketService } from '../services/api';
import { Ticket, PlusCircle, AlertCircle, Sparkles, Filter } from 'lucide-react';
import Loading from '../components/Loading';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter settings
  const [filterStatus, setFilterStatus] = useState('All');

  // Load user tickets on mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const list = await ticketService.getTickets();
        setTickets(list);
      } catch (err) {
        console.error('Failed to load tickets:', err);
        setError('Could not load tickets. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Input validations
    if (!title.trim() || title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setError('Description must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      const data = await ticketService.createTicket(title.trim(), description.trim(), priority);
      setTickets((prev) => [data, ...prev]);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setSuccess('Support ticket created successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit support ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTicket = async (ticketId, status, priority) => {
    try {
      const updated = await ticketService.updateTicket(ticketId, status, priority);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? updated : t))
      );
    } catch (err) {
      console.error('Failed to update ticket parameters:', err);
      setError('Failed to update ticket status');
    }
  };

  // Filtered tickets selector
  const filteredTickets = tickets.filter(t => {
    if (filterStatus === 'All') return true;
    return t.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b13]">
        <Loading size="lg" text="Retrieving your tickets..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b13] px-4 md:px-8 py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Ticket className="h-7 w-7 text-green-400" />
            <span>Support Tickets</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Submit support tickets to ApexTech developers and track response workflows.</p>
        </div>

        {/* WORKSPACE LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLUMN 1: CREATE TICKET FORM */}
          <div className="glass border border-white/5 rounded-3xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-green-400" />
              <span>Submit Support Ticket</span>
            </h2>

            {error && (
              <div className="flex items-start space-x-2 bg-red-950/40 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start space-x-2 bg-green-950/40 border border-green-500/30 text-green-200 px-4 py-3 rounded-xl text-xs">
                <Sparkles className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              {/* TITLE */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Ticket Title</label>
                <input
                  type="text"
                  placeholder="e.g. Invoices fail to load"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-green-500 text-slate-100 text-sm rounded-xl py-3 px-4 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description details</label>
                <textarea
                  placeholder="Provide detailed information regarding the bug or billing inquiry (min 10 characters)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-green-500 text-slate-100 text-sm rounded-xl py-3 px-4 focus:outline-none transition-all duration-200 resize-none"
                />
              </div>

              {/* PRIORITY SELECTION */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Priority Severity</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 text-xs font-bold rounded-lg border uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        priority === p
                          ? p === 'High' ? 'bg-red-500/15 border-red-500/40 text-red-400' :
                            p === 'Medium' ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' :
                            'bg-blue-500/15 border-blue-500/40 text-blue-400'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-700/50 text-slate-950 font-bold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-green-500/15 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
              >
                {submitting ? <Loading size="sm" text="" /> : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    <span>Create Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* COLUMN 2 & 3: FILTERING & TICKETS GRID VIEW (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* FILTER CONTROLS */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h2 className="text-xl font-bold text-slate-200">Ticket Register</h2>
              
              <div className="flex items-center space-x-2 text-slate-400">
                <Filter className="h-4 w-4" />
                <span className="text-xs">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="All">All Tickets</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* TICKETS CONTAINER */}
            {filteredTickets.length === 0 ? (
              <div className="glass border border-white/5 rounded-3xl p-16 text-center text-slate-400">
                <Ticket className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold">No support tickets found matching current status filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onUpdate={handleUpdateTicket}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default TicketManagement;
