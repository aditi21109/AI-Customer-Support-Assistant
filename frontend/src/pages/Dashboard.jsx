import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketService, chatService } from '../services/api';
import { LayoutDashboard, MessageSquare, Ticket, User, Sparkles, PlusCircle, ArrowRight, ClipboardList } from 'lucide-react';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [chatsCount, setChatsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [fetchedTickets, fetchedChats] = await Promise.all([
          ticketService.getTickets(),
          chatService.getHistory(),
        ]);
        setTickets(fetchedTickets);
        setChatsCount(fetchedChats.length);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const openTickets = tickets.filter(t => t.status !== 'Resolved');
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b13]">
        <Loading size="lg" text="Loading your dashboard statistics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b13] px-4 md:px-8 py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
              <LayoutDashboard className="h-7 w-7 text-green-400" />
              <span>Support Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <span className="text-green-400 font-semibold">{user?.name}</span>. Review support activity and open tickets.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              to="/chat"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-green-500/10 cursor-pointer text-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Chat with AI</span>
            </Link>
            
            <Link
              to="/tickets"
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-100 font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm"
            >
              <PlusCircle className="h-4 w-4 text-green-400" />
              <span>New Ticket</span>
            </Link>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Tickets */}
          <div className="glass border border-white/5 rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Ticket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Total Tickets</p>
              <p className="text-2xl font-black text-white mt-0.5">{tickets.length}</p>
            </div>
          </div>

          {/* Open Tickets */}
          <div className="glass border border-white/5 rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Active Tickets</p>
              <p className="text-2xl font-black text-white mt-0.5">{openTickets.length}</p>
            </div>
          </div>

          {/* Resolved Tickets */}
          <div className="glass border border-white/5 rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3.5 bg-green-500/10 rounded-xl border border-green-500/20 text-green-400">
              <Ticket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Resolved Tickets</p>
              <p className="text-2xl font-black text-white mt-0.5">{resolvedTickets.length}</p>
            </div>
          </div>

          {/* AI Conversations */}
          <div className="glass border border-white/5 rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">AI Chats Logged</p>
              <p className="text-2xl font-black text-white mt-0.5">{chatsCount}</p>
            </div>
          </div>
        </div>

        {/* WORKSPACE CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: RECENT ACTIVE TICKETS (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-200">Active Support Tickets</h2>
              <Link to="/tickets" className="text-xs text-green-400 hover:text-green-300 font-semibold flex items-center space-x-1">
                <span>Manage all tickets</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {openTickets.length === 0 ? (
              <div className="glass border border-white/5 rounded-2xl p-8 text-center text-slate-400 space-y-3">
                <p>No active support tickets found.</p>
                <Link to="/tickets" className="inline-block text-xs bg-white/5 hover:bg-white/10 text-slate-200 px-4 py-2 rounded-xl border border-white/5 transition-all">
                  Create a new ticket
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {openTickets.slice(0, 4).map((ticket) => (
                  <div key={ticket.id} className="glass border border-white/5 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-100 line-clamp-1">{ticket.title}</h4>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        ticket.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        ticket.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ticket.description}</p>
                    <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500 border-t border-white/5">
                      <span>Status: <strong className="text-green-400 font-medium">{ticket.status}</strong></span>
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: QUICK TIPS & ACTION GUIDE (1/3 width on desktop) */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-200">AI Assistant Guidelines</h2>
            <div className="glass border border-white/5 rounded-2xl p-5 space-y-4 text-sm leading-relaxed text-slate-300">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-500/10 rounded border border-green-500/20 text-green-400 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs">Self-Service AI Chat</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Interact with our AI agent in real-time to solve issues concerning logins, payments, or server downtime instantly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400 mt-0.5">
                    <PlusCircle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs">Escalate to Engineers</h4>
                    <p className="text-xs text-slate-400 mt-0.5">If the AI cannot resolve the inquiry, create a support ticket. Engineers will update status coordinates in real-time.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-amber-500/10 rounded border border-amber-500/20 text-amber-400 mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs">Profile Controls</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Manage user credentials and review platform configurations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
