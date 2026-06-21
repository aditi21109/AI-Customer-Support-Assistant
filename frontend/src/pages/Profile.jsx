import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Key, AlertOctagon } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="min-h-screen bg-[#070b13] px-4 md:px-8 py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
            <User className="h-7 w-7 text-green-400" />
            <span>User Profile</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage credentials and authentication details.</p>
        </div>

        {/* DETAILS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* PROFILE SUMMARY LEFT (1/3) */}
          <div className="glass border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center font-bold text-3xl animate-pulse">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{user?.name}</h2>
              <span className="text-xs text-green-400 font-semibold bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mt-2">
                Standard Client
              </span>
            </div>
          </div>

          {/* PROFILE STATS & FIELDS RIGHT (2/3) */}
          <div className="md:col-span-2 glass border border-white/5 rounded-3xl p-6 space-y-6">
            
            {/* PERSONAL METADATA */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Account Credentials</span>
              </h3>

              {/* NAME FIELD */}
              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <span className="text-slate-400">Full Name</span>
                <span className="font-semibold text-slate-200">{user?.name}</span>
              </div>

              {/* EMAIL FIELD */}
              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <span className="text-slate-400">Email Address</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{user?.email}</span>
                </span>
              </div>

              {/* DATE JOINED */}
              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <span className="text-slate-400">Account Created</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formattedDate}</span>
                </span>
              </div>

              {/* USER ID */}
              <div className="flex items-center justify-between text-sm py-2">
                <span className="text-slate-400">Client ID</span>
                <span className="font-mono text-xs text-slate-400">{user?.id}</span>
              </div>
            </div>

            {/* SECURITY RECOMMENDATION ALERT */}
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 flex items-start space-x-3 text-xs leading-relaxed text-amber-200">
              <AlertOctagon className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-300">Security Credentials Notice</h4>
                <p className="mt-0.5 text-amber-200/80">
                  Authentication tokens persist locally for 24 hours. If logging in from a public device, remember to click the Log Out button in the navigation header to clear session cookies.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
