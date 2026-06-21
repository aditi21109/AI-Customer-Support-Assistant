import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';
import supportMascot from '../assets/support_mascot.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      const success = await login(data.access_token);
      if (success) {
        navigate('/');
      } else {
        setError('Failed to load user profile session');
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || err.response?.data?.detail || 'Invalid email or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#070510] px-4 py-12 relative overflow-hidden gap-8 md:gap-16">
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

      {/* MASCOT DIALOG PANEL */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-xs relative z-10 select-none animate-pulse">
        {/* Retro Dialog Bubble */}
        <div className="bg-[#0f0b21] border-4 border-[#a200ff] text-white p-4 font-mono relative box-shadow shadow-[4px_4px_0px_#ff007f] text-xs">
          <p className="uppercase leading-relaxed tracking-wider">
            "WELCOME ADVENTURER! LOG IN AND I'LL HELP YOU SORT YOUR SUPPORT TICKETS!"
          </p>
          {/* Bubble Arrow */}
          <div className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-[#a200ff]"></div>
        </div>
        
        {/* Character Image */}
        <img 
          src={supportMascot} 
          alt="Support Mascot" 
          className="w-48 h-48 border-4 border-[#ff007f] bg-black/40 box-shadow shadow-[6px_6px_0px_#a200ff] pixelated"
        />
        
        <div className="text-[#ff007f] font-bold text-xs uppercase tracking-wider font-display">
          [ APEX-BOT ]
        </div>
      </div>

      {/* LOGIN CARD */}
      <div className="relative w-full max-w-md glass border border-white/5 p-8 shadow-2xl z-10">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight font-display">Welcome Back</h2>
          <p className="text-slate-400 mt-2 text-sm">Sign in to contact AI support & manage tickets</p>
        </div>

        {/* ERROR PROMPT */}
        {error && (
          <div className="mb-6 flex items-start space-x-2 bg-red-950/40 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm animate-shake">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-green-500 text-slate-100 text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-green-500 text-slate-100 text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-700/50 text-slate-950 font-bold text-sm py-3.5 rounded-xl cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-green-500/10 flex items-center justify-center space-x-2 mt-8 disabled:cursor-not-allowed"
          >
            {loading ? <Loading size="sm" text="" /> : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* FOOTER ACTION */}
        <div className="mt-8 text-center text-sm">
          <p className="text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-200">
              Create one now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
