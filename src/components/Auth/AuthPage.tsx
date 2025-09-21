import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Heart, Star, Crown } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gradient-animated relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-white/20 animate-float">
          <Sparkles size={40} />
        </div>
        <div className="absolute top-20 right-20 text-white/20 rotate-slow">
          <Heart size={30} />
        </div>
        <div className="absolute bottom-20 left-20 text-white/20 animate-bounce">
          <Star size={35} />
        </div>
        <div className="absolute bottom-10 right-10 text-white/20 animate-pulse">
          <Crown size={45} />
        </div>
        
        {/* Floating candy shapes */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-yellow-400/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-7 h-7 bg-green-400/30 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left side - Branding and illustration */}
          <div className="text-center lg:text-left text-white space-y-6">
            <div className="inline-flex items-center space-x-3 mb-8">
              <div className="relative">
                <ShoppingBag className="h-12 w-12 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-shadow-lg">Sweet Shop</h1>
                <div className="text-lg text-white/90">Management System</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-semibold text-shadow-lg">
                Welcome to Sweet Paradise! 🍭
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Discover the sweetest collection of treats, from artisanal chocolates to 
                delightful candies. Your sweet tooth's dream destination awaits!
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🍫</div>
                <div className="text-sm font-medium">Premium Quality</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="text-sm font-medium">Fast Delivery</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-sm font-medium">5-Star Rating</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💝</div>
                <div className="text-sm font-medium">Gift Ready</div>
              </div>
            </div>
          </div>

          {/* Right side - Auth form */}
          <div className="bounce-in">
            <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl">
              
              {/* Tab selector */}
              <div className="flex mb-8 p-1 bg-white/10 rounded-2xl backdrop-blur-sm">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    activeTab === 'login'
                      ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    activeTab === 'register'
                      ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form content */}
              <div className="slide-up">
                {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
              </div>

              {/* Demo credentials */}
              <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-center text-sm text-white/90">
                  <div className="font-medium mb-2">🎯 Demo Credentials</div>
                  <div className="space-y-1">
                    <div>Admin: <span className="font-mono bg-white/20 px-2 py-1 rounded">admin@sweetshop.com</span></div>
                    <div>Password: <span className="font-mono bg-white/20 px-2 py-1 rounded">admin123</span></div>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-1 text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                <div className="text-sm text-white/80">
                  Join 10,000+ happy customers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;