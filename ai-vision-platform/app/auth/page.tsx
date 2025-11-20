'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Use Python Flask backend
      const API_BASE_URL = 'http://localhost:5000';
      const endpoint = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/signup`;
      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.user && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-5">
      <div className="flex max-w-[1100px] w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 p-[60px] text-white relative overflow-hidden">
          <div className="absolute -top-1/2 -right-1/5 w-[400px] h-[400px] bg-white/8 rounded-full"></div>
          <div className="absolute -bottom-[30%] -left-[10%] w-[300px] h-[300px] bg-white/6 rounded-full"></div>
          
          <div className="relative z-10">
            <h1 className="text-[28px] font-bold mb-3 tracking-tight">AI Vision Platform</h1>
            <p className="text-[15px] opacity-90 leading-relaxed font-light">
              Advanced object detection and intelligent analysis powered by state-of-the-art machine learning models
            </p>
          </div>

          <div className="relative z-10 mt-10">
            <div className="flex items-start mb-7">
              <div className="w-11 h-11 bg-white/15 rounded-[10px] flex items-center justify-center mr-[18px] backdrop-blur-sm">
                <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1.5">YOLO Object Detection</h3>
                <p className="text-sm opacity-90 leading-relaxed font-light">
                  Real-time object detection with industry-leading accuracy and performance metrics
                </p>
              </div>
            </div>

            <div className="flex items-start mb-7">
              <div className="w-11 h-11 bg-white/15 rounded-[10px] flex items-center justify-center mr-[18px] backdrop-blur-sm">
                <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4M12 8h.01"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1.5">AI-Powered Q&A</h3>
                <p className="text-sm opacity-90 leading-relaxed font-light">
                  Ask questions about detected objects using Gemini's advanced natural language understanding
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-11 h-11 bg-white/15 rounded-[10px] flex items-center justify-center mr-[18px] backdrop-blur-sm">
                <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1.5">Interactive Analysis</h3>
                <p className="text-sm opacity-90 leading-relaxed font-light">
                  Sortable results with detailed confidence scores and bounding box coordinates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-[60px] flex flex-col justify-center">
          <div className="mb-9">
            <h2 className="text-[32px] font-bold text-slate-900 mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-[15px] text-slate-500">
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Sign up to start analyzing images with AI'}
            </p>
          </div>

          <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-[10px]">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-6 rounded-lg text-[15px] font-semibold transition-all ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'bg-transparent text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-6 rounded-lg text-[15px] font-semibold transition-all ${
                !isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'bg-transparent text-slate-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-[22px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required={!isLogin}
                    className="w-full py-3.5 pl-12 pr-4 border-[1.5px] border-slate-200 rounded-[10px] text-[15px] focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="mb-[22px]">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full py-3.5 pl-12 pr-4 border-[1.5px] border-slate-200 rounded-[10px] text-[15px] focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="mb-[22px]">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  required
                  className="w-full py-3.5 pl-12 pr-12 border-[1.5px] border-slate-200 rounded-[10px] text-[15px] focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="mb-[22px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required={!isLogin}
                    className="w-full py-3.5 pl-12 pr-4 border-[1.5px] border-slate-200 rounded-[10px] text-[15px] focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-[18px] h-[18px] mr-2 accent-blue-600"
                  />
                  <span className="text-sm text-slate-600 font-medium">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-blue-600 font-semibold hover:text-blue-800">
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-[15px] bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-[10px] text-base font-semibold shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40 transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
