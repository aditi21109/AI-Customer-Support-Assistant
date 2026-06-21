import React, { useState } from 'react';
import { Calendar, AlertCircle, RefreshCw, CheckCircle2, MoreHorizontal } from 'lucide-react';

const TicketCard = ({ ticket, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const formattedDate = new Date(ticket.created_at).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Priority Styles
  const priorityClasses = {
    High: 'bg-red-500/10 text-red-400 border-red-500/25',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    Low: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
  };

  // Status Styles & Icons
  const statusClasses = {
    Open: 'bg-green-500/10 text-green-400 border-green-500/25',
    'In Progress': 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    Resolved: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  };

  const statusIcons = {
    Open: AlertCircle,
    'In Progress': RefreshCw,
    Resolved: CheckCircle2,
  };

  const StatusIcon = statusIcons[ticket.status] || AlertCircle;

  const handleStatusChange = async (e) => {
    setUpdating(true);
    await onUpdate(ticket.id, e.target.value, ticket.priority);
    setUpdating(false);
  };

  const handlePriorityChange = async (e) => {
    setUpdating(true);
    await onUpdate(ticket.id, ticket.status, e.target.value);
    setUpdating(false);
  };

  return (
    <div className="glass border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 shadow-md flex flex-col justify-between">
      <div>
        {/* HEADER: TITLE & PRIORITY */}
        <div className="flex items-start justify-between space-x-2">
          <h3 className="font-bold text-slate-100 text-base leading-snug line-clamp-1" title={ticket.title}>
            {ticket.title}
          </h3>
          
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
            priorityClasses[ticket.priority] || priorityClasses.Low
          }`}>
            {ticket.priority}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-slate-400 mt-2.5 line-clamp-3 leading-relaxed whitespace-pre-wrap">
          {ticket.description}
        </p>
      </div>

      {/* METADATA & ACTIONS PANEL */}
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* TIME & STATUS */}
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>

          <span className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border ${
            statusClasses[ticket.status] || statusClasses.Open
          }`}>
            <StatusIcon className={`h-3 w-3 ${ticket.status === 'In Progress' && 'animate-spin'}`} />
            <span>{ticket.status}</span>
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center space-x-2">
          {/* Change Status */}
          <select
            value={ticket.status}
            onChange={handleStatusChange}
            disabled={updating}
            className="bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-green-500 transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Change Priority */}
          <select
            value={ticket.priority}
            onChange={handlePriorityChange}
            disabled={updating}
            className="bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-green-500 transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
