import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      setError('Full Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
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
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
      // 1. Submit Registration API Call
      await authService.register(name.trim(), email.trim(), password);
      
      // 2. Perform Automatic Login on Success
      const loginData = await authService.login(email.trim(), password);
      const success = await login(loginData.access_token);
      
      if (success) {
        navigate('/');
      } else {
        setError('Registered, but failed to log you in automatically. Please log in manually.');
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || err.response?.data?.detail || 'Registration failed. Email might be in use.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b13] px-4 py-12 relative overflow-hidden">
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

      {/* REGISTER CARD */}
      <div className="relative w-full max-w-md glass border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight font-display">Create Account</h2>
          <p className="text-slate-400 mt-2 text-sm">Join ApexTech AI Customer Support portal</p>
        </div>

        {/* ERROR PROMPT */}
        {error && (
          <div className="mb-6 flex items-start space-x-2 bg-red-950/40 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm animate-shake">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-green-500 text-slate-100 text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="jane@example.com"
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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-green-500 text-slate-100 text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-green-500 text-slate-100 text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-700/50 text-slate-950 font-bold text-sm py-3.5 rounded-xl cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-green-500/10 flex items-center justify-center space-x-2 mt-6 disabled:cursor-not-allowed"
          >
            {loading ? <Loading size="sm" text="" /> : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Register Account</span>
              </>
            )}
          </button>
        </form>

        {/* FOOTER ACTION */}
        <div className="mt-8 text-center text-sm">
          <p className="text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-200">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
