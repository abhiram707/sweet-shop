import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@sweetshop.com');
    setPassword('admin123');
    setError('');
    
    try {
      await login('admin@sweetshop.com', 'admin123');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Welcome Back! 👋</h3>
        <p className="text-white/80">Sign in to access your sweet treats</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white/90">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={`h-5 w-5 transition-colors duration-200 ${
                emailFocused ? 'text-purple-400' : 'text-white/60'
              }`} />
            </div>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 backdrop-blur-sm"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-white/90">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={`h-5 w-5 transition-colors duration-200 ${
                passwordFocused ? 'text-purple-400' : 'text-white/60'
              }`} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 backdrop-blur-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-200 text-sm bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm animate-shake">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Forgot Password Link */}
        <div className="text-right">
          <button type="button" className="text-sm text-white/80 hover:text-white transition-colors duration-200">
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-ripple w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>

        {/* Demo Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>🚀</span>
          <span>Try Demo Login</span>
        </button>
      </form>

      {/* Additional Info */}
      <div className="text-center pt-4 border-t border-white/20">
        <p className="text-sm text-white/80">
          New to Sweet Shop?{' '}
          <button className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200">
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;