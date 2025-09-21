import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [roleFocused, setRoleFocused] = useState(false);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(email, password, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Join Sweet Shop! 🎉</h3>
        <p className="text-white/80">Create your account and start your sweet journey</p>
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
                emailFocused ? 'text-green-400' : 'text-white/60'
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
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 backdrop-blur-sm"
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
                passwordFocused ? 'text-green-400' : 'text-white/60'
              }`} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 backdrop-blur-sm"
              placeholder="Create a secure password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Password strength:</span>
                <span className={`font-medium ${
                  passwordStrength.strength >= 75 ? 'text-green-400' :
                  passwordStrength.strength >= 50 ? 'text-yellow-400' :
                  passwordStrength.strength >= 25 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${passwordStrength.strength}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium text-white/90">
            Account Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className={`h-5 w-5 transition-colors duration-200 ${
                roleFocused ? 'text-green-400' : 'text-white/60'
              }`} />
            </div>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'customer')}
              onFocus={() => setRoleFocused(true)}
              onBlur={() => setRoleFocused(false)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
            >
              <option value="customer" className="bg-gray-800 text-white">🛍️ Customer - Browse and purchase sweets</option>
              <option value="admin" className="bg-gray-800 text-white">👑 Admin - Manage inventory and orders</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-white/60" />
            </div>
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

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
          <input 
            type="checkbox" 
            id="terms" 
            required
            className="mt-1 w-4 h-4 text-green-500 bg-transparent border-white/30 rounded focus:ring-green-400 focus:ring-2"
          />
          <label htmlFor="terms" className="text-sm text-white/90 leading-relaxed">
            I agree to the{' '}
            <button type="button" className="text-yellow-400 hover:text-yellow-300 underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-yellow-400 hover:text-yellow-300 underline">
              Privacy Policy
            </button>
          </label>
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-ripple w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>
      </form>

      {/* Additional Info */}
      <div className="text-center pt-4 border-t border-white/20">
        <p className="text-sm text-white/80">
          Already have an account?{' '}
          <button className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200">
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;